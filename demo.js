(function() {
  var convert;

  convert = function(rawData) {
    var child, j, k, len, len1, node, ref, ref1, state, subTree, timeElapsed, timeFormat, value;
    value = 0;
    ref = ['RUNNABLE', 'BLOCKED', 'TIMED_WAITING', 'WAITING'];
    for (j = 0, len = ref.length; j < len; j++) {
      state = ref[j];
      if (!isNaN(rawData.c[state])) {
        value += rawData.c[state];
      }
    }
    timeElapsed = new Date();
    timeElapsed.setSeconds(value);
    timeFormat = countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS;
    node = {
      name: rawData.n,
      value: value,
      time: countdown(new Date(), timeElapsed, timeFormat),
      children: []
    };
    if (!rawData.a) {
      return node;
    }
    ref1 = rawData.a;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      child = ref1[k];
      subTree = convert(child);
      if (subTree) {
        node.children.push(subTree);
      }
    }
    return node;
  };

  d3.json("data/profile.json", function(err, data) {
    var flameGraph, profile, tooltip;
    profile = convert(data.profile);
    tooltip = function(d) {
      return d.name + " <br /><br /> " + d.value + " samples<br /> " + (((d.value / profile.value) * 100).toFixed(2)) + "% of total";
    };
    flameGraph = d3.flameGraph().size([1200, 600]).cellHeight(20).data(profile).zoomEnabled(true).tooltip(tooltip).render('#d3-flame-graph');
    d3.select('#highlight').on('click', function() {
      var nodes;
      nodes = flameGraph.select(/java\.util.*/);
      return nodes.classed("highlight", function(d, i) {
        return !d3.select(this).classed("highlight");
      });
    });
    return d3.select('#zoom').on('click', function() {
      var node;
      node = flameGraph.select(/java\.util\.concurrent.*/, false)[0];
      return flameGraph.zoom(node);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlbW8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsU0FBQyxPQUFEO0FBQ1IsUUFBQTtJQUFBLEtBQUEsR0FBUTtBQUNSO0FBQUEsU0FBQSxxQ0FBQTs7TUFDRSxJQUE2QixDQUFJLEtBQUEsQ0FBTSxPQUFPLENBQUMsQ0FBRSxDQUFBLEtBQUEsQ0FBaEIsQ0FBakM7UUFBQSxLQUFBLElBQVMsT0FBTyxDQUFDLENBQUUsQ0FBQSxLQUFBLEVBQW5COztBQURGO0lBR0EsV0FBQSxHQUFrQixJQUFBLElBQUEsQ0FBQTtJQUNsQixXQUFXLENBQUMsVUFBWixDQUF1QixLQUF2QjtJQUNBLFVBQUEsR0FBYSxTQUFTLENBQUMsSUFBVixHQUFpQixTQUFTLENBQUMsS0FBM0IsR0FBbUMsU0FBUyxDQUFDLE9BQTdDLEdBQXVELFNBQVMsQ0FBQztJQUM5RSxJQUFBLEdBQ0U7TUFBQSxJQUFBLEVBQU0sT0FBTyxDQUFDLENBQWQ7TUFDQSxLQUFBLEVBQU8sS0FEUDtNQUVBLElBQUEsRUFBTSxTQUFBLENBQWMsSUFBQSxJQUFBLENBQUEsQ0FBZCxFQUFzQixXQUF0QixFQUFtQyxVQUFuQyxDQUZOO01BR0EsUUFBQSxFQUFVLEVBSFY7O0lBTUYsSUFBZSxDQUFJLE9BQU8sQ0FBQyxDQUEzQjtBQUFBLGFBQU8sS0FBUDs7QUFDQTtBQUFBLFNBQUEsd0NBQUE7O01BQ0UsT0FBQSxHQUFVLE9BQUEsQ0FBUSxLQUFSO01BQ1YsSUFBRyxPQUFIO1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFkLENBQW1CLE9BQW5CLEVBREY7O0FBRkY7V0FLQTtFQXJCUTs7RUF1QlYsRUFBRSxDQUFDLElBQUgsQ0FBUSxtQkFBUixFQUE2QixTQUFDLEdBQUQsRUFBTSxJQUFOO0FBQzNCLFFBQUE7SUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLElBQUksQ0FBQyxPQUFiO0lBQ1YsT0FBQSxHQUFVLFNBQUMsQ0FBRDthQUFVLENBQUMsQ0FBQyxJQUFILEdBQVEsZ0JBQVIsR0FDZixDQUFDLENBQUMsS0FEYSxHQUNQLGlCQURPLEdBRWhCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFGLEdBQVUsT0FBTyxDQUFDLEtBQW5CLENBQUEsR0FBNEIsR0FBN0IsQ0FBaUMsQ0FBQyxPQUFsQyxDQUEwQyxDQUExQyxDQUFELENBRmdCLEdBRThCO0lBRnZDO0lBR1YsVUFBQSxHQUFhLEVBQUUsQ0FBQyxVQUFILENBQUEsQ0FDWCxDQUFDLElBRFUsQ0FDTCxDQUFDLElBQUQsRUFBTyxHQUFQLENBREssQ0FFWCxDQUFDLFVBRlUsQ0FFQyxFQUZELENBR1gsQ0FBQyxJQUhVLENBR0wsT0FISyxDQUlYLENBQUMsV0FKVSxDQUlFLElBSkYsQ0FLWCxDQUFDLE9BTFUsQ0FLRixPQUxFLENBTVgsQ0FBQyxNQU5VLENBTUgsaUJBTkc7SUFRYixFQUFFLENBQUMsTUFBSCxDQUFVLFlBQVYsQ0FDRSxDQUFDLEVBREgsQ0FDTSxPQUROLEVBQ2UsU0FBQTtBQUNYLFVBQUE7TUFBQSxLQUFBLEdBQVEsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsY0FBbEI7YUFDUixLQUFLLENBQUMsT0FBTixDQUFjLFdBQWQsRUFBMkIsU0FBQyxDQUFELEVBQUksQ0FBSjtlQUFVLENBQUksRUFBRSxDQUFDLE1BQUgsQ0FBVSxJQUFWLENBQWUsQ0FBQyxPQUFoQixDQUF3QixXQUF4QjtNQUFkLENBQTNCO0lBRlcsQ0FEZjtXQUtBLEVBQUUsQ0FBQyxNQUFILENBQVUsT0FBVixDQUNFLENBQUMsRUFESCxDQUNNLE9BRE4sRUFDZSxTQUFBO0FBRVgsVUFBQTtNQUFBLElBQUEsR0FBTyxVQUFVLENBQUMsTUFBWCxDQUFrQiwwQkFBbEIsRUFBOEMsS0FBOUMsQ0FBcUQsQ0FBQSxDQUFBO2FBQzVELFVBQVUsQ0FBQyxJQUFYLENBQWdCLElBQWhCO0lBSFcsQ0FEZjtFQWxCMkIsQ0FBN0I7QUF2QkEiLCJmaWxlIjoiZGVtby5qcyIsInNvdXJjZXNDb250ZW50IjpbIiMgZnVuY3Rpb24gdGhhdCBjb252ZXJ0cyBmcm9tIGEgcGFydGljdWxhciBkYXRhIGZvcm1hdCBpbnRvIHRoZSBnZW5lcmljIG9uZVxuIyBleHBlY3RlZCBieSB0aGUgcGx1Z2luXG5jb252ZXJ0ID0gKHJhd0RhdGEpIC0+XG4gIHZhbHVlID0gMFxuICBmb3Igc3RhdGUgaW4gWydSVU5OQUJMRScsICdCTE9DS0VEJywgJ1RJTUVEX1dBSVRJTkcnLCAnV0FJVElORyddXG4gICAgdmFsdWUgKz0gcmF3RGF0YS5jW3N0YXRlXSBpZiBub3QgaXNOYU4ocmF3RGF0YS5jW3N0YXRlXSlcblxuICB0aW1lRWxhcHNlZCA9IG5ldyBEYXRlKClcbiAgdGltZUVsYXBzZWQuc2V0U2Vjb25kcyh2YWx1ZSlcbiAgdGltZUZvcm1hdCA9IGNvdW50ZG93bi5EQVlTIHwgY291bnRkb3duLkhPVVJTIHwgY291bnRkb3duLk1JTlVURVMgfCBjb3VudGRvd24uU0VDT05EU1xuICBub2RlID1cbiAgICBuYW1lOiByYXdEYXRhLm4sXG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIHRpbWU6IGNvdW50ZG93bihuZXcgRGF0ZSgpLCB0aW1lRWxhcHNlZCwgdGltZUZvcm1hdClcbiAgICBjaGlsZHJlbjogW11cblxuICAjIHRoZSBhIGZpZWxkIGlzIHRoZSBsaXN0IG9mIGNoaWxkcmVuXG4gIHJldHVybiBub2RlIGlmIG5vdCByYXdEYXRhLmFcbiAgZm9yIGNoaWxkIGluIHJhd0RhdGEuYVxuICAgIHN1YlRyZWUgPSBjb252ZXJ0KGNoaWxkKVxuICAgIGlmIHN1YlRyZWVcbiAgICAgIG5vZGUuY2hpbGRyZW4ucHVzaChzdWJUcmVlKVxuXG4gIG5vZGVcblxuZDMuanNvbiBcImRhdGEvcHJvZmlsZS5qc29uXCIsIChlcnIsIGRhdGEpIC0+XG4gIHByb2ZpbGUgPSBjb252ZXJ0KGRhdGEucHJvZmlsZSlcbiAgdG9vbHRpcCA9IChkKSAtPiBcIiN7ZC5uYW1lfSA8YnIgLz48YnIgLz5cbiAgICAje2QudmFsdWV9IHNhbXBsZXM8YnIgLz5cbiAgICAjeygoZC52YWx1ZSAvIHByb2ZpbGUudmFsdWUpICogMTAwKS50b0ZpeGVkKDIpfSUgb2YgdG90YWxcIlxuICBmbGFtZUdyYXBoID0gZDMuZmxhbWVHcmFwaCgpXG4gICAgLnNpemUoWzEyMDAsIDYwMF0pXG4gICAgLmNlbGxIZWlnaHQoMjApXG4gICAgLmRhdGEocHJvZmlsZSlcbiAgICAuem9vbUVuYWJsZWQodHJ1ZSlcbiAgICAudG9vbHRpcCh0b29sdGlwKVxuICAgIC5yZW5kZXIoJyNkMy1mbGFtZS1ncmFwaCcpXG5cbiAgZDMuc2VsZWN0KCcjaGlnaGxpZ2h0JylcbiAgICAub24gJ2NsaWNrJywgKCkgLT5cbiAgICAgIG5vZGVzID0gZmxhbWVHcmFwaC5zZWxlY3QoL2phdmFcXC51dGlsLiovKVxuICAgICAgbm9kZXMuY2xhc3NlZChcImhpZ2hsaWdodFwiLCAoZCwgaSkgLT4gbm90IGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIpKVxuXG4gIGQzLnNlbGVjdCgnI3pvb20nKVxuICAgIC5vbiAnY2xpY2snLCAoKSAtPlxuICAgICAgIyBqdW1wIHRvIHRoZSBmaXJzdCBqYXZhLnV0aWwuY29uY3VycmVudCBtZXRob2Qgd2UgY2FuIGZpbmRcbiAgICAgIG5vZGUgPSBmbGFtZUdyYXBoLnNlbGVjdCgvamF2YVxcLnV0aWxcXC5jb25jdXJyZW50LiovLCBmYWxzZSlbMF1cbiAgICAgIGZsYW1lR3JhcGguem9vbShub2RlKSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
