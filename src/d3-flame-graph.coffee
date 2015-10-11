d3 = window.d3
throw new Error("d3.js needs to be loaded") if not d3

d3.flameGraph = ->

  getClassAndMethodName = (fqdn) ->
    tokens = fqdn.split(".")
    tokens.slice(tokens.length - 2).join(".")

  # Return a vector (0.0->1.0) that is a hash of the input string.
  # The hash is computed to favor early characters over later ones, so
  # that strings with similar starts have similar vectors. Only the first
  # 6 characters are considered.
  hash = (name) ->
    [result, maxHash, weight, mod] = [0, 0, 1, 10]
    name = getClassAndMethodName(name).slice(0, 6)
    for i in [0..(name.length-1)]
      result += weight * (name.charCodeAt(i) % mod)
      maxHash += weight * (mod - 1)
      weight *= 0.7
    if maxHash > 0 then result / maxHash else result

  class FlameGraph
    constructor: () ->
      @_generateAccessors([
        'size',
        'margin',
        'cellHeight',
        'breadcrumbs',
        'tooltip',
        'color'])
      @_allData = []
      # defaults
      @_size        = [1200, 800]
      @_cellHeight  = 10
      @_margin      = { top: 0, right: 0, bottom: 0, left: 0 }
      @_color       = (d) ->
        val = hash(d.name)
        r = 200 + Math.round(55 * val)
        g = 0 + Math.round(230 * (1 - val))
        b = 0 + Math.round(55 * (1 - val))
        "rgb(#{r}, #{g}, #{b})"


    data: (data) ->
      return @_data if not data
      @_allData.push(data)
      @totalSamples = data.samples
      @_data = d3.layout.partition()
        .sort((a,b) -> a.name.localeCompare(b.name))
        .nodes(data)
      @

    width: () -> @size()[0] - (@margin().left + @margin().right)

    height: () -> @size()[1] - (@margin().top + @margin().bottom)

    label: (d) ->
      return "" if not d?.name
      label = getClassAndMethodName(d.name)
      label.substr(0, Math.round(@x(d.dx) / 4))

    render: (selector) ->
      console.time('render')

      # refresh container
      @_selector = selector
      d3.select(selector).select('svg').remove()
      @container = d3.select(selector)
        .append('svg')
          .attr('class', 'flame-graph')
          .attr('width', @size()[0])
          .attr('height', @size()[1])
          .style('border', '1px solid #0e0e0e')
        .append('g')
          .attr('transform', "translate(#{@margin().left}, #{@margin().top})")


      @maxCells = Math.floor(@height() / @cellHeight())
      @maxDepth = @data()[0].maxDepth

      @x = d3.scale.linear()
        .domain([0, d3.max(@data(), (d) -> d.x + d.dx)])
        .range([0, @width()])
      @y = d3.scale.quantize()
        .domain([d3.max(@data(), (d) -> d.y), 0])
        .range(d3.range(@maxDepth)
          .map((cell) =>  (cell - @maxDepth + @maxCells) * @cellHeight()))

      @container
        .selectAll('.node')
        .data(@data().filter((d) =>
          @x(d.dx) > 0.1 and @y(d.y) >= 0 and d.type != 'filler'))
        .enter()
          .append('rect')
            .attr('class', 'node')
            .attr 'width', (d) => @x(d.dx)
            .attr('height', (d) => @cellHeight())
            .attr('x', (d) => @x(d.x))
            .attr('y', (d) => @y(d.y))
            .attr('fill', (d) => @color()(d))
            .attr('fill-opacity', '0.8')

      @container
        .selectAll('.label')
        .data(@data().filter((d) => d.name and @x(d.dx) > 40))
        .enter()
          .append('text')
            .attr('class', 'label')
            .attr('dy', '.25em')
            .attr('x', (d) => @x(d.x) + 2)
            .attr('y', (d) => @y(d.y) + @cellHeight() / 2)
            .text((d) => @label(d))

      console.timeEnd('render')
      console.log("Rendered #{@container.selectAll('.node')[0].length} elements")
      @_enableNavigation()._renderBreadcrumbs() if @breadcrumbs()
      @_renderTooltip()                         if @tooltip()
      @

    _renderTooltip: () ->
      @tip = d3.tip()
        .attr('class', 'd3-tip')
        .html((d) => "#{d.name} <br /><br />#{d.totalTime} run time<br />#{((d.samples / @totalSamples) * 100).toFixed(2)}% of total")
        .direction (d) =>
          return 'w' if @x(d.x) + @x(d.dx) / 2 > @width() - 100
          return 'e' if @x(d.x) + @x(d.dx) / 2 < 100
          return 's' if @y(d.y) < 100
          return 'n' # otherwise
        .offset([- @cellHeight() / 2, 0])

      @container.call(@tip)
      @container
        .selectAll('.node')
          .on 'mouseover', @tip.show
          .on 'mouseout', @tip.hide
      @container
        .selectAll('.label')
          .on 'mouseover', @tip.show
          .on 'mouseout', @tip.hide
      @

    _renderBreadcrumbs: () ->
      breadcrumbData = @_allData.map((prevData, idx) -> { name: prevData.name, value: idx })
      breadcrumbs = d3.select(@breadcrumbs())
        .selectAll('li')
        .data(breadcrumbData)

      breadcrumbs.enter()
        .append('li')
          .append('a')
            .attr('title', (d) -> d.name)
            .text((d) -> getClassAndMethodName(d.name))
            .on 'click', (breadcrumb) =>
              idx = breadcrumb.value
              displayed = @_allData[idx]
              @_allData = @_allData.slice(0, idx)
              @data(displayed).render(@_selector)

      breadcrumbs.exit().remove()
      @

    _enableNavigation: () ->
      @container
        .selectAll('.node')
        .on 'click', (d) => @data(d).render(@_selector)
      @container
        .selectAll('.label')
        .on 'click', (d) => @data(d).render(@_selector)
      @

    _generateAccessors: (accessors) ->
      for accessor in accessors
        @[accessor] = do (accessor) ->
          (newValue) ->
            return @["_#{accessor}"] if not arguments.length
            @["_#{accessor}"] = newValue
            return @

  return new FlameGraph()