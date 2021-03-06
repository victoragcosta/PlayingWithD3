class RocketProgressBar {
  /**
   * Creates an instance of RocketProgressBar and creates an svg for the graph
   *
   * @constructor
   * @author victoragcosta
   * @param {string} selector A CSS like selector representing the element to put the graph inside
   */
  constructor(selector) {
    this._data = 0;

    let div = d3.select(selector);

    this.width = div.node().getBoundingClientRect().width;
    this.height = 400;
    this.margin = {
      top: 190,
      bottom: 20,
      left: 0,
      right: 0,
    };

    this.svg = div.append("svg");

    // Create graph with 0,0 at the bottom center
    this.chart = this.svg
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("font-family", "sans-serif")
      .attr("fill", "steelblue")
      .style("display", "block")
      .append("g")
      .attr(
        "transform",
        `translate(${this.width / 2},${this.height - this.margin.bottom})` +
          " scale(1,-1)"
      );

    this.y = d3
      .scaleLinear()
      .clamp(false)
      .domain([0, 1])
      .rangeRound([0, this.height - this.margin.top - this.margin.bottom]);

    // Create graphical elements
    this.createElements();
    // Render animations and positioning
    this.render();
  }

  axisGenerator(
    scale,
    transition,
    ticks,
    length = 50,
    thickness = 4,
    outerSize = 120
  ) {
    return (chart) => {
      chart
        .selectAll("g.ticks")
        .data(ticks, d3.format("~%"))
        .join(
          (enter) =>
            enter
              .append("g")
              .call((g) =>
                g
                  .append("rect")
                  .style("fill", "currentColor")
                  .transition(transition)
                  .attr("x", -length / 2)
                  .attr("y", -thickness)
                  .attrTween("width", function () {
                    return function (t) {
                      return Math.abs(t * length);
                    };
                  })
                  .attrTween("height", function () {
                    return function (t) {
                      return Math.abs(t * thickness);
                    };
                  })
              )
              .call((g) =>
                g
                  .append("line")
                  .style("stroke", "currentColor")
                  .style("stroke-width", "0.5")
                  .transition(transition)
                  .attr("x1", (d, i) => (i % 2 ? -length / 2 : length / 2))
                  .attr("y1", -thickness / 2)
                  .attr("x2", (d, i) => (i % 2 ? -outerSize : outerSize))
                  .attr("y2", -thickness / 2)
              )
              .call((g) =>
                g
                  .append("text")
                  .style("fill", "currentColor")
                  .attr("transform", "scale(1,-1)")
                  .attr("y", thickness)
                  .attr("dy", "-0.35em")
                  .style("font-size", "0em")
                  .style("text-anchor", (d, i) => (i % 2 ? "start" : "end"))
                  .transition(transition)
                  .attr("x", (d, i) => (i % 2 ? -outerSize : outerSize))
                  .style("font-size", "1.5em")
                  .text(d3.format("~%"))
              ),
          (update) =>
            update
              .call((g) =>
                g
                  .select("line")
                  .transition(transition)
                  .attr("x1", (d, i) => (i % 2 ? -length / 2 : length / 2))
                  .attr("x2", (d, i) => (i % 2 ? -outerSize : outerSize))
              )
              .call((g) =>
                g
                  .select("text")
                  .transition(transition)
                  .attr("x", (d, i) => (i % 2 ? -outerSize : outerSize))
                  .style("text-anchor", (d, i) => (i % 2 ? "start" : "end"))
              ),
          (exit) =>
            exit
              .transition(transition)
              .call((g) =>
                g
                  .select("rect")
                  .attr("x", 0)
                  .attrTween("width", function () {
                    return function (t) {
                      return Math.abs((1 - t) * length);
                    };
                  })
                  .attrTween("height", function () {
                    return function (t) {
                      return Math.abs((1 - t) * thickness);
                    };
                  })
              )
              .call((g) =>
                g
                  .select("line")
                  .attr("x1", 0)
                  .attr("y1", 0)
                  .attr("x2", 0)
                  .attr("y2", 0)
              )
              .call((g) =>
                g.select("text").attr("x", 0).style("font-size", "0em")
              )
              .remove()
        )
        .attr("class", "ticks")
        .attr("opacity", "1")
        .attr("transform", (d) => `translate(0,${scale(d)})`);
    };
  }

  createRocket(element) {
    element
      .append("g")
      .html(
        `<style type="text/css">
          .st0{fill:#EEEEEE;}
          .st1{fill:#2DA1FE;}
          .st2{fill:#1E7CF9;}
          .st3{fill:#FBA980;}
          .st4{fill:#F8773F;}
        </style>
        <g>
          <path class="st0" d="M267.8,769.9c-12.6-2.6-25.3-4.4-37.6-8c-18-5.3-32.6-15.1-42-31.7c-1.1-2-2.5-3.1-4.1-4.3
            c-0.5-4.3-2.3-8.2-4.1-12.1c-5.3-11.5-7.3-23.8-8.9-36.3c-1.6-12.9-4.3-25.6-6.1-38.5c-1.8-12.9-2.7-26-4.5-38.9
            c-2.2-16.3-3.5-32.6-4.7-49c-0.8-11.1-1.3-22.1-1.9-33.2c-0.5-9.8-1.8-19.7-1.4-29.5c0.5-11.9-0.7-23.7-0.3-35.5
            c1.5-11.7-0.2-23.5,0.3-35.2c0.6-13.3,2-26.5,3.7-39.7c2.1-16.9,4.1-33.7,7.2-50.4c1.9-10,3.8-20.2,6.2-30.1
            c7.8-31,16.7-61.8,28.4-91.6c16-40.7,33.9-80.5,57-117.8c12.4-20,25.5-39.7,40.3-58c8.2-10.2,16.5-21,28.2-28.2
            c3.9-2.4,7.6-3.2,11.5-0.6c11.4,7.6,20.3,17.7,29.4,27.8c6.5,7.2,12.4,14.8,18.2,22.5c12.4,16.5,24,33.7,34.4,51.5
            c12.6,21.4,24.5,43.3,34.5,66c14.9,33.7,28.2,68.1,38.1,103.8c6.9,25.1,12.5,50.5,16.9,76.2c2.4,13.9,3.2,28.1,4.6,42.2
            c1.5,15.7,1.6,31.4,2.4,47c0.5,8.9,0,17.9-0.1,26.9c0.5,18.2-1.1,36.4-1.8,54.6c-0.8,19.7-2.5,39.3-4.5,58.9
            c-2.4,22.8-5,45.5-9.2,68.1c-1.6,8.6-2.5,17.4-4,26c-2.1,12.7-3.6,25.7-9.8,37.6c-4,7.8-9,15.2-12.4,23.3
            c-4.6,2.3-7.6,6.6-11.5,9.8c-16.7,13.8-36.4,19.1-57,22.6c-4.5,0.8-9.4,0.3-13.6,2.9C349,773.1,308.4,773.8,267.8,769.9z"/>
          <path class="st1" d="M541.7,481.6c5.4,2.6,10.2,6.2,14,10.6c3.8,4.4,8.3,7.9,12.1,12.3c10,11.4,20,22.8,28.1,35.7
            c3.4,5.5,7.1,10.7,10.5,16.3c8.1,13.4,15.1,27.2,21.7,41.5c5.5,12.1,10.5,24.3,15.1,36.7c5.1,13.9,9.2,28.1,12,42.6
            c1.9,10.1,4.7,20.2,4.7,30.4c0,16.8,1.4,34-8.5,49.3c-4.9,7.5-11.5,11.3-19.9,12.7c-17.4,2.8-33.3-3.7-48.5-10.2
            c-15.8-6.8-31.8-12.6-48.3-17.3c-9.9-2.8-20.1-4.6-30.1-6.8c3.4-6.5,8-12.3,10.7-19.3c4.7-12.5,5.2-25.5,6.4-38.6
            c2.3-24,6.2-47.8,8.2-71.9c1.2-14.9,3.6-29.7,4.7-44.7c1.3-16.2,4.3-32.2,4.8-48.5C539.4,502,542.3,491.9,541.7,481.6z"/>
          <path class="st1" d="M156,730c-18.7,3.4-36.7,9.3-54.3,16.1c-8.5,3.3-16.9,7.3-25.3,11c-12.3,5.4-24.7,11-38.2,11.9
            c-19.9,1.3-30.1-5.6-35.7-27.3c-3.6-14-2.7-28.5-0.6-42.9c2.9-19.5,8.4-38.1,14.6-56.8c14.8-44.7,37.9-85,64.9-123
            c10.7-15,22.9-29.2,37.2-41.3c3.3,14.9,3.3,30.2,5.3,45.3c1.6,11.7,2.4,23.4,3.7,35.1c1,9,2.7,17.9,3.2,26.9
            c0.9,19.2,4.8,38.1,5.9,57.3c0.8,13.3,3.7,26.3,4.6,39.7c0.4,6.2,0.1,12.7,2,18.9C146.4,711.1,150.1,721.1,156,730z"/>
          <path class="st2" d="M156,730c-6-9-9.6-18.9-12.8-29.2c-1.9-6.2-1.6-12.7-2-18.9c-0.9-13.3-3.8-26.4-4.6-39.7
            c-1.1-19.2-5-38.1-5.9-57.3c-0.4-9-2.2-17.9-3.2-26.9c-1.3-11.7-2.2-23.4-3.7-35.1c-2-15.1-2-30.4-5.3-45.3
            c10.2-8.2,19.8-17.1,31.2-23.7c0.8-0.5,1.9-0.7,2.8-1c-0.3,11.8,0.8,23.6,0.3,35.5c-0.4,9.8,0.9,19.7,1.4,29.5
            c0.6,11.1,1.1,22.1,1.9,33.2c1.2,16.4,2.4,32.7,4.7,49c1.8,12.9,2.7,26,4.5,38.9c1.8,12.9,4.5,25.6,6.1,38.5
            c1.6,12.5,3.6,24.8,8.9,36.3c1.8,3.9,3.6,7.7,4.1,12.1C175.1,727.3,165.6,728.7,156,730z"/>
          <path class="st2" d="M541.7,481.6c0.6,10.4-2.3,20.4-2.6,30.6c-0.4,16.3-3.5,32.3-4.8,48.5c-1.2,14.9-3.5,29.7-4.7,44.7
            c-2,24.1-5.9,47.9-8.2,71.9c-1.2,13.1-1.7,26.1-6.4,38.6c-2.6,7-7.3,12.8-10.7,19.3c-6.2,2-12.3-0.5-18.4-0.8
            c-4.7-0.2-9.3-0.1-14-0.3c3.4-8.2,8.4-15.5,12.4-23.3c6.2-11.9,7.6-24.9,9.8-37.6c1.5-8.6,2.4-17.5,4-26
            c4.2-22.6,6.9-45.3,9.2-68.1c2-19.6,3.7-39.2,4.5-58.9c0.8-18.2,2.4-36.3,1.8-54.6c4-1.3,6.5,1.9,9.4,3.5
            C529.6,472.8,536.7,475.7,541.7,481.6z"/>
          <g class="rocket-flame">
            <path class="st3" d="M413.2,789.6c1.9,5.2,6,9,8.3,14.1c3.6,8,5.5,16.1,6.7,24.6c2.2,15.8-2.1,30.6-5.9,45.7
              c-7.9,31.1-23,58.8-41.4,84.6c-8.7,12.2-19.8,22.7-33.8,28.6c-12.8,5.4-25.8,4.9-38.5-2.3c-14.9-8.4-25.6-20.9-35.1-34.5
              c-9.5-13.6-17.2-28.1-23.9-43.3c-4.8-10.8-8.7-22-11.7-33.3c-5.7-21.4-10.2-43.1-0.6-64.8c2.9-6.5,6-13,10.5-18.6
              c9.9,5.2,19.9,9.6,30.7,12.9c17.9,5.5,36.2,6.9,54.5,7.2c10,0.1,20.2-1,30.3-2.8C380.9,804.4,398,799.9,413.2,789.6z"/>
            <path class="st4" d="M413.2,789.6c-15.2,10.2-32.3,14.8-50,18.1c-10.1,1.9-20.3,3-30.3,2.8c-18.3-0.3-36.7-1.7-54.5-7.2
              c-10.8-3.3-20.8-7.8-30.7-12.9c5.6-8.1,13.2-14.3,20.6-20.6c40.6,3.9,81.1,3.2,121.7-0.5C398.7,775,406.1,782.1,413.2,789.6z"/>
          </g>
          <path class="st1" d="M234.1,326.5c-0.6,12.9,1.3,26.6-1,40.3c-1.4,8.3-4.9,15.3-11.1,20.9c-2.5,2.2-3.7,3.3-0.1,6.3
            c10,8.2,12.6,19.9,12.9,32.2c0.3,13.9,0.2,27.8,0.4,41.7c0.2,13.2,6.9,20.2,21.8,19.1c2.9-0.2,5-0.2,4.3,4.3
            c-0.8,5.2,0,10.7,0.2,16.1c0.2,3.2-1.1,4.3-4.3,4.3c-9.3,0-18.3-1.1-27.2-3.9c-14.6-4.8-20.7-16.4-22.7-30.2
            c-1.6-10.9-1-22.2-0.9-33.3c0-5.8,0.4-11.8,0-17.7c-0.6-7.5-3.3-13.9-8.4-19.3c-1.3-1.4-3.6-3-5.3-2.8c-8.8,1.1-9.5-4.4-9.6-10.8
            c0-0.6,0.5-1.2,0.4-1.7c-1.6-9.2,1.5-13.9,11.4-15.4c6.2-0.9,11.2-15,10.8-22.6c-0.7-12.6-0.5-25.2-0.6-37.9
            c-0.1-8.2,1-16.1,4-23.8c4.6-11.9,14-17.9,25.6-20.9c6.5-1.7,13.4-2,20.2-2.3c3.5-0.2,5.1,0.8,4.7,4.4c-0.1,1.4,0.1,2.9-0.1,4.3
            c-0.6,4.9,2.4,10.9-0.5,14.5c-2.6,3.2-8.7,1.5-13.2,2.5c-6.8,1.6-11.8,9.1-12.2,19C233.6,317.8,234,321.7,234.1,326.5z
            M434.1,419.9c-0.3,14.3-0.3,28.5,0.3,42.8c0.6,14.1-5.5,22.1-18.9,23.1c-6.9,0.6-8.5,2.7-7.1,9.3c0.3,1.2,0.7,2.4,0.6,3.6
            c-0.7,11.7-0.7,11.6,10.9,11c9.1-0.5,18.1-1.9,25.9-6.7c12.1-7.5,16.4-19.8,16.8-33.3c0.4-15.9-0.2-31.9-0.2-47.9
            c0-9.4,6.4-18.1,15.7-20.3c5.2-1.3,6.9-3.2,6.1-8.7c-0.5-3.2-1.2-7.1-0.3-10.2c1.6-5.5-1.1-6.4-5.3-7c-8.3-1.2-14.2-7.6-16-15.8
            c-1.6-7.3-1.4-14.8-1.3-22c0.2-11.1,0.1-22.2-0.7-33.2c-1.1-15.4-7.8-27.3-23.3-33.2c-8.7-3.3-17.7-2.4-26.5-4
            c-2.9-0.5-4.9,1.4-4.6,5c0.3,4.9,0.6,9.9,0.4,14.8c-0.2,4.1,1.2,4.8,5.3,5c12.1,0.6,20,3.7,20.7,18.3c0.6,13.8,1.4,27.7,0.9,41.5
            c-0.6,15,4.1,27,15.9,36.6C439.4,396.8,434.4,407.4,434.1,419.9z M323.9,327.7c-15.9,2.9-32.6,13.8-32.2,34.1
            c0.3,14.5,5.6,24.3,17.6,31.3c6.3,3.6,13,6.2,19.7,8.8c6.1,2.4,12.3,4.6,17.5,8.8c3.5,2.9,4.9,6.5,3.9,11c-1.1,4.6-4.2,7.3-8.4,8.1
            c-6.3,1.2-12.8,2-19.3,1.2c-8.4-1-16.6-2.6-24.6-5.4c-2.5-0.9-4.2-1.7-4.4,2.7c-0.2,5-1.9,10.1-3.3,15c-1,3.5-0.1,4.9,3.5,6.1
            c7.4,2.4,14.8,4.7,22.6,4.8c15.2,0.3,30.1,0.7,44.7-5.8c21-9.3,23.5-39.6,10-53.2c-8.4-8.5-19.4-12.3-30.2-16.5
            c-5.8-2.2-11.6-4.5-16.7-8.1c-3.8-2.7-5.2-6.6-4.5-10.9c0.7-4,3.3-6.4,7.5-8c8-3.1,16-2.2,24.1-1.2c5.5,0.7,12.4,4.7,16.1,2.6
            c4.3-2.5,2-10.8,4-16c1.9-4.9-0.2-6.4-4.2-7.3c-10.3-2.3-20.6-3.7-32.6-3.8C331.8,324.9,327.9,327,323.9,327.7z"/>
        </g>`
      )
      .select("g")
      .attr("transform", "scale(0.2)");
  }

  createSmoke(element, scale = 1.8) {
    let smokeColor = "#cbcbcb";
    // Create path
    let path = element
      .append("path")
      .attr(
        "d",
        "m 10 0 v 10 c 0 14 -8 7 -5 4 c -6 1 -5 9 0 9 c 1 0 3 1 7 -3 c 4 4 6 3 7 3 c 5 0 6 -8 0 -9 c 3 3 -5 10 -5 -4 v -10 z "
      )
      .attr("opacity", "0.9")
      .style("mix-blend-mode", "multiply")
      .style("fill", smokeColor);

    // Get size
    let { width, height } = path.node().getBBox();

    // align 0,0 to mid bottom and scale up
    path.attr(
      "transform",
      `translate(${(-width * scale) / 2},${
        height * scale
      }) scale(${scale},${-scale})`
    );

    // Add growing bar
    element
      .append("rect")
      .style("fill", smokeColor)
      .attr("opacity", 0.9)
      .attr("x", -scale * 1.2)
      .attr("y", 23 * scale)
      .attr("width", scale * 4)
      .attr("height", 10);
  }

  createElements() {
    // Create axis Y
    this.yAxis = this.chart.append("g");

    // Create smokes
    this.smokes = this.chart.append("g").attr("class", "smokes");
    let smoke = this.smokes.append("g").attr("class", "smoke");
    let scale = 1.5;
    this.createSmoke(smoke.attr("transform", "translate(3,10)"), scale);

    smoke = this.smokes.append("g").attr("class", "smoke");
    scale = 2;
    this.createSmoke(smoke.attr("transform", "translate(15,0)"), scale);

    smoke = this.smokes.append("g").attr("class", "smoke");
    scale = 1.8;
    this.createSmoke(smoke.attr("transform", "translate(-15,3)"), scale);

    // Create rocket container
    this.rocket = this.chart.append("g");
    // Add rocket to svg
    this.createRocket(this.rocket);
    // Calculate rocket size
    let bBox = this.rocket.select("g").node().getBoundingClientRect();
    this.rocketWidth = bBox.width;
    this.rocketHeight = bBox.height;
    // Center rocket
    this.rocket
      .select("g")
      .attr(
        "transform",
        `translate(${-this.rocketWidth / 2},${this.rocketHeight * 0.78})` +
          " scale(1,-1)"
      );
    // Save flame reference
    this.rocketFlame = this.rocket.select(".rocket-flame");

    this.yAxis = this.yAxis
      .attr("transform", `translate(0,${this.rocketHeight * 0.78})`)
      .append("g");
  }

  render(duration = 2000) {
    // Create a new transition to synchronize everything
    const y = this.y;
    const t = this.svg.transition().duration(duration).ease(d3.easeBack);

    // Recalculate and ajust ticks
    let min = d3.min([y.domain()[0], this._data]);
    let max = d3.max([y.domain()[1], this._data]);
    let yAxisGen = this.axisGenerator(
      y,
      t,
      d3.ticks(min, max, (max - min) * 10)
    );
    this.yAxis.call(yAxisGen);

    // Move rocket to correct height
    this.rocket
      .transition(t)
      .attr("transform", `translate(0,${y(this._data)})`);

    let data = this._data;
    let oldData = this._oldData;
    // Adjust size of flame relative to position
    this.rocketFlame.transition(t).attrTween("transform", function () {
      return function (t) {
        let scaling = d3.min([
          1,
          d3.max([0, (1 / 0.2) * ((data - oldData) * t + oldData)]),
        ]);
        let transformX = (413.2 - 39.42 * 2) * (1 - scaling); // - 39.42 * scaling;
        let transformY = (789.6 - 40.25 / 2) * (1 - scaling);
        return `translate(${transformX},${transformY}) scale(${scaling})`;
      };
    });

    // Adjust smoke length to match rocket position
    let oldHeight = +this.smokes.select("rect").attr("height");
    this.smokes
      .selectAll("rect")
      .transition(t)
      .attrTween("height", function () {
        return function (t) {
          let out = (y(data) - oldHeight) * t + oldHeight;
          if (out >= 0) return out;
          return 0;
        };
      });

    // Adjust size of the smoke end when too close to the ground
    this.smokes.transition(t).attrTween("transform", function () {
      return function (t) {
        return `scale(${d3.min([
          1,
          d3.max([0, (1 / 0.2) * ((data - oldData) * t + oldData)]),
        ])})`;
      };
    });

    // Move the scale in case the rocket extrapolates the domain
    if (this._data > y.domain()[1] || this._data < y.domain()[0]) {
      this.chart
        .transition(t)
        .attr(
          "transform",
          `translate(${this.width / 2},${this.margin.top + y(this._data)})` +
            " scale(1,-1)"
        );
    } else {
      this.chart
        .transition(t)
        .attr(
          "transform",
          `translate(${this.width / 2},${this.height - this.margin.bottom})` +
            " scale(1,-1)"
        );
    }
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._oldData = this._data;
    this._data = data;
    this.render();
  }

  setData(data, duration) {
    this._oldData = this._data;
    this._data = data;
    this.render(duration);
  }
}
