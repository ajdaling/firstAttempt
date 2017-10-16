(function ($) {

  $.pbv = function (element, options) {

    let defaults = {
      data: [],
      topicColors: ["#F2385A", "#F5A503", "#56D9CD", "#3AA1BF", "#9B51E0"]
    };

    let plugin = this;

    plugin.settings = {};

    let visualization;
    let tooltip;
    let tooltipContent;
    let tooltipArrow;
    let tooltipWidth = 350;
    let tooltipMaxHeight = 300;
    let body = document.querySelector('body');

    var maxWidth, maxHeight;
    if (document.querySelector('.chart')) {
      maxWidth = document.querySelector('.chart').offsetWidth - 60;
      maxHeight = document.querySelector('.chart').offsetHeight - 60;
    } else {
      maxHeight = maxWidth = 0;
    }

    let phaseHeight = maxHeight / 2;
    let phaseBoundariesColor = "#cccccc";
    let phaseLabelHeight = 45;
    let phaseLabelColor = "#333333";
    let phaseLabelTextColor = "#ffffff";
    let phaseLabelArrowWidth = 15;
    let zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on("zoom", function () {
        zoomed();
      });
    let selectedTopics = [];
    let selectedOrganization = [];
    let totalDocuments = 0;
    let finalData = [];
    let topicMapping = ["Neuro", "Cardio", "Cancer", "Transplant", "Muscoloskel", "Gastroent"];
    let topicSelect; //let topicSelect = document.querySelector('.dropdown--topics');
    let topicsAddedList; //let topicsAddedList = document.querySelector('.dropdown-list--topics');
    let organizationSelect; //let organizationSelect = document.querySelector('.dropdown--organizations');
    let organizationsAddedList; //let organizationsAddedList = document.querySelector('.dropdown-list--organizations');
    let formattedData;
    let phaseLabels;
    let totalPhases;
    let phaseWidth;
    let allTopics;
    let allOrgs;
    let dataSourceSizes;
    let minDocAmount;
    let maxDocAmount;
    let dataSourceRanges;

    plugin.init = function () {
      plugin.settings = $.extend({}, defaults, options);

      formattedData = objectMapping(plugin.settings.data);
      phaseLabels = _.map(_.uniqBy(formattedData, 'phase'), 'phase');
      totalPhases = phaseLabels.length;
      phaseWidth = Math.floor(maxWidth / totalPhases);
      allTopics = _.map(_.uniqBy(formattedData, 'topicId'), 'topicId').sort();
      allOrgs = _.map(_.uniqBy(formattedData, 'organization'), 'organization');
      dataSourceSizes = findDocumentAmountDivisors(phaseWidth);
      minDocAmount = _.minBy(plugin.settings.data, function (object) {
        return object[3];
      })[3];
      maxDocAmount = _.maxBy(plugin.settings.data, function (object) {
        return object[3];
      })[3];

      // max 5 sizes for now
      dataSourceRanges = calculateDataSourceRanges(minDocAmount, maxDocAmount, 5);

      if (formattedData) {
        activate(formattedData, dataSourceRanges);
      } else {
        console.log("no data provided");
      }
    };

    let activate = function (formattedData, dataSourceRanges) {

      let aboveAvgData = [];
      let belowAvgData = [];

      _.each(formattedData, function (object) {
        totalDocuments += object.documents;
        object.originalColor = object.color = plugin.settings.topicColors[object.topicId];
      });

      normalizeDatasourceSize(formattedData, dataSourceRanges);

      let averageDocumentsPerOrg = Math.floor(totalDocuments / formattedData.length);

      for (let q = 0; q < totalPhases; q++) {
        let sources = _.filter(formattedData, function (object) {
          return object.phase === phaseLabels[q];
        });

        aboveAvgData.push(_.filter(sources, function (object) {
          return object.documents >= averageDocumentsPerOrg;
        }));

        belowAvgData.push(_.filter(sources, function (object) {
          return object.documents < averageDocumentsPerOrg;
        }));

        finalData = aboveAvgData.concat(belowAvgData);
      }

      buildControls(allTopics, allOrgs);

      createChartLayout(finalData);

      createVisualization(finalData);

      let dropdownToggle = document.querySelectorAll('.dropdown-toggle');
      let dropdownSelected = document.querySelectorAll('.dropdown-selected');
      let dropdown = document.querySelectorAll('.dropdown');

      body.addEventListener("click", function (event) {
        clearTooltip();

        for (let i = 0; i < dropdown.length; i++) {
          if (!(isDescendant(dropdown[i], event.target) && dropdown[i] !== event.target) && dropdown[i].classList.contains('is-open')) {
            dropdown[i].classList.remove('is-open');
          }
        }
      });

      let controls = document.querySelector('.controls');
      let toggle = document.querySelector('.toggle');

      toggle.addEventListener('click', function () {
        if (controls.classList.contains('is-open')) {
          controls.classList.remove('is-open');
        } else {
          controls.classList.add('is-open');
        }
      });

      for (let i = 0; i < dropdownToggle.length; i++) {
        dropdownToggle[i].addEventListener('click', function () {
          if (this.parentNode.classList.contains('is-open')) {
            this.parentNode.classList.remove('is-open');
          } else {
            this.parentNode.classList.add('is-open');
          }
        });

        dropdownSelected[i].addEventListener('click', function () {
          if (this.parentNode.classList.contains('is-open')) {
            this.parentNode.classList.remove('is-open');
          } else {
            this.parentNode.classList.add('is-open');
          }
        });
      }

    };

    let normalizeDatasourceSize = function (formattedData, dataSourceRanges) {

      let sizes = [20, 40, 60, 80, 100]; // predefined set of size
      _.each(formattedData, function (data) {
        let index = _.findIndex(dataSourceRanges, function (o) {
          return data.documents >= o.min && data.documents <= o.max;
        });

        //    data.value = (((data.documents - minDocAmount) * newRange) / oldRange) + newMin;
        data.value = sizes[index];

      });
    };

    let buildOrganizationDropdown = function (organizations) {
      let fragment = document.createDocumentFragment();

      _.each(organizations, function (organization) {
        let li = document.createElement("li");
        li.className = 'dropdown-list_item';

        li.innerHTML = "<a class='dropdown-list_item--organizations' href='#'>" +
          "<span class='dropdown-name'>" +
          organization +
          "</span>" +
          "</a>";

        li.addEventListener("click", function (event) {
          event.stopPropagation();

          if (selectedOrganization.indexOf(event.target.innerText) > -1) {
            return;
          }

          let li = document.createElement("li");
          li.className = "selectedItem";

          li.innerHTML = "<span class='selectedItem-name'>" + event.target.innerText + "</span>" +
            "<button class='selectedItem-close'>" +
            "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24'><path d='M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z'/></svg>" +
            "</button>";


          // remove
          li.addEventListener("click", function (event) {
            event.stopPropagation();
            let target = findParentNodeUntilClass(event.target, "selectedItem");
            organizationsAddedList.removeChild(target);

            selectedOrganization = _.filter(selectedOrganization, (currentObject) => {
              return currentObject != target.innerText;
            });
            rebuildChart();

          });


          fragment.appendChild(li);

          selectedOrganization.push(event.target.innerText);
          selectedOrganization = _.uniq(selectedOrganization);
          rebuildChart();


          organizationsAddedList.appendChild(fragment);
        });

        fragment.appendChild(li);
      });

      organizationSelect.appendChild(fragment);
    };

    let buildTopicDropdown = function (topics) {
      let fragment = document.createDocumentFragment();

      _.each(topics, function (topic) {
        let li = document.createElement("li");
        li.className = "dropdown-list_item";

        li.innerHTML = "<a class='dropdown-list_item--topics' href='#'>" +
          "<span class='dropdown-color' style='background-color:" + plugin.settings.topicColors[topic] + "'>" +
          "</span>" +
          "<span class='dropdown-name'>" +
          topicMapping[topic] +
          "</span>" +
          "</a>";


        li.addEventListener("click", function (event) {
          event.stopPropagation();

          let topicId = _.findIndex(topicMapping, function (o) {
            return o == event.target.innerText;
          });

          if (selectedTopics.indexOf(topicId) > -1) {
            return;
          }

          let li = document.createElement("li");
          li.className = "selectedItem";

          li.innerHTML = "<span class='selectedItem-color' style='background-color:" + plugin.settings.topicColors[topicId] + "'></span>" +
            "<span class='selectedItem-name'>" + event.target.innerText + "</span>" +
            "<button class='selectedItem-close'>" +
            "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24'><path d='M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z'/></svg>" +
            "</button>";


          // remove
          li.addEventListener("click", function (event) {
            event.stopPropagation();
            let target = findParentNodeUntilClass(event.target, "selectedItem");
            topicsAddedList.removeChild(target);

            let topicId = _.findIndex(topicMapping, function (o) {
              return o == target.innerText;
            });

            selectedTopics = _.filter(selectedTopics, (currentObject) => {
              return currentObject != topicId;
            });

            rebuildChart();

          });

          fragment.appendChild(li);

          selectedTopics.push(topicId);
          selectedTopics = _.uniq(selectedTopics);
          topicsAddedList.appendChild(fragment);

          rebuildChart();

        });

        fragment.appendChild(li);
      });

      topicSelect.appendChild(fragment);
    };

    let createChartLayout = function (data) {
      tooltip = d3.select(".chart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("width", tooltipWidth + "px")
        .style("max-height", tooltipMaxHeight + "px");

      tooltipContent = tooltip.append("div")
        .attr("class", "tooltip-content");

      tooltipArrow = tooltip.append("svg")
        .attr("height", 30)
        .attr("width", 47)
        .attr("class", "tooltip-arrow")
        .append("path")
        .attr("d", "M 45.4142 16.1421C 46.1953 15.3611 46.1953 14.0948 45.4142 13.3137L 32.6863 0.585825C 31.9052 -0.195275 30.6389 -0.195275 29.8579 0.585825C 29.0768 1.36682 29.0768 2.63313 29.8579 3.41423L 41.1716 14.7279L 29.8579 26.0416C 29.0768 26.8227 29.0768 28.089 29.8579 28.87C 30.6389 29.6511 31.9052 29.6511 32.6863 28.87L 45.4142 16.1421ZM 0 16.7279L 44 16.7279L 44 12.7279L 0 12.7279L 0 16.7279Z");

      visualization = d3
        .select(".chart")
        .append("svg")
        .attr("width", maxWidth)
        .attr("height", maxHeight);

      visualization
        .call(zoom)
        .append("g")
        .on("click", function (d) {
          clearTooltip();
        });

      for (let i = 0; i < totalPhases; i++) {

        //drawing phase labels
        switch (i) {
          case 0:
            visualization
              .append("path")
              .attr("d", roundLabel((i * phaseWidth), (phaseHeight - (phaseLabelHeight / 2)), phaseWidth, phaseLabelHeight, (phaseLabelHeight / 2), "left"))
              .attr("fill", phaseLabelColor);
            break;
          case (totalPhases - 1):
            visualization
              .append("path")
              .attr("d", roundLabel((i * phaseWidth), (phaseHeight - (phaseLabelHeight / 2)), phaseWidth, phaseLabelHeight, (phaseLabelHeight / 2), "right"))
              .attr("fill", phaseLabelColor);
            break;
          default:
            visualization
              .append("rect")
              .attr("x", (i * phaseWidth))
              .attr("y", (phaseHeight - (phaseLabelHeight / 2)))
              .attr("width", phaseWidth)
              .attr("height", phaseLabelHeight)
              .attr("fill", phaseLabelColor);
            break;
        }

        //drawing phase labels
        visualization
          .append("text")
          .text(phaseLabels[i])
          .attr("x", ((i * phaseWidth) + (phaseWidth / 2)))
          .attr("y", phaseHeight) //4 is a magic number right now to center text in label
          .attr("fill", phaseLabelTextColor)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "central")
          .attr("font-family", "Raleway");

        //drawing phase boundaries
        if (i < (totalPhases - 1)) {
          //top boundaries
          visualization
            .append("line")
            .attr("x1", (phaseWidth * (i + 1)))
            .attr("y1", 0)
            .attr("x2", (phaseWidth * (i + 1)))
            .attr("y2", (phaseHeight - (phaseLabelHeight / 2)))
            .attr("stroke-width", 1)
            .attr("stroke", phaseBoundariesColor)
            .attr("stroke-dasharray", "4, 4");

          //bottom boundaries
          visualization
            .append("line")
            .attr("x1", (phaseWidth * (i + 1)))
            .attr("y1", (phaseHeight + (phaseLabelHeight / 2)))
            .attr("x2", (phaseWidth * (i + 1)))
            .attr("y2", maxHeight)
            .attr("stroke-width", 1)
            .attr("stroke", phaseBoundariesColor)
            .attr("stroke-dasharray", "4, 4");
        }

        //drawing phase label arrows
        if (i > 0) {
          visualization
            .append("line")
            .attr("x1", (phaseWidth * i))
            .attr("y1", (phaseHeight - (phaseLabelHeight / 2)))
            .attr("x2", ((phaseWidth * i) + phaseLabelArrowWidth))
            .attr("y2", phaseHeight)
            .attr("stroke-width", 1)
            .attr("stroke", phaseBoundariesColor)
            .attr("stroke-dasharray", "4, 4");

          visualization
            .append("line")
            .attr("x1", ((phaseWidth * i) + phaseLabelArrowWidth))
            .attr("y1", phaseHeight)
            .attr("x2", (phaseWidth * i))
            .attr("y2", (phaseHeight + (phaseLabelHeight / 2)))
            .attr("stroke-width", 1)
            .attr("stroke", phaseBoundariesColor)
            .attr("stroke-dasharray", "4, 4");
        }
      }
    };

    let createVisualization = function (data) {
      if (visualization) {
        visualization.selectAll("g")
          .transition()
          .duration(200)
          .style("opacity", 0)
          .remove();
      }

      for (let i = 0; i < totalPhases; i++) {
        runVisualization(data[i], i, "above");
        runVisualization(data[i + totalPhases], i, "below");
      }
    };

    let roundLabel = function (x, y, width, height, radius, side) {
      let path = "";

      switch (side) {
        case "left":
          path = "M" + x + "," + (y + radius)
            + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
            + "h" + (width - radius)
            + "v" + height
            + "h" + (radius - width)
            + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
            + "z";
          break;
        case "right":
          path = "M" + x + "," + y
            + "h" + (width - radius)
            + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
            + "v" + (height - 2 * radius)
            + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
            + "h" + (radius - width)
            + "z";
          break;
      }

      return path;
    };

    let findDocumentAmountDivisors = function (number) {
      let divisors = [];
      for (let i = 1; i <= number; i++) {
        if ((number % i) === 0) {
          divisors.push(i);
        }
      }
      return divisors;
    };

    let calculateDataSourceRanges = function (minDocumentAmount, maxDocumentAmount, divisors) {
      let dataSourceRanges = [];
      let dataSourcesPerRange = Math.floor((maxDocumentAmount - minDocumentAmount) / divisors);

      let subSetMin = 0;
      let subSetMax = 0;

      for (let i = 0; i < divisors; i++) {
        if (i === 0) {
          subSetMin = minDocumentAmount;
          subSetMax = minDocumentAmount;
        } else {
          subSetMin = dataSourceRanges[i - 1].max + 1;
          subSetMax = dataSourceRanges[i - 1].max + 1;
        }

        for (let j = 0; j < dataSourcesPerRange; j++) {
          subSetMax++;
        }

        dataSourceRanges.push({
          min: subSetMin,
          max: subSetMax
        });
      }

      return dataSourceRanges;
    };

    let clearTooltip = function () {
      d3.select("body").classed("has-overlay", false);

      if (tooltip) {
        tooltip.selectAll(".tooltip-data").html("");
        tooltip.style("display", "none");
        tooltip.style("opacity", 0);
      }
    };

    let runVisualization = function (nodes, moveX, loc) {

      let force = d3.layout.force()
        .friction(0.4)
        .size([phaseWidth, (phaseHeight - (phaseLabelHeight / 2))]);

      if (!nodes) {
        return;
      }

      nodes.forEach(setRandomPositionAtTopOfBounds);

      let magnetNodes;
      if (loc === "above") {
        magnetNodes = nodes.map(magnetNodeForNode);
      } else {
        magnetNodes = nodes.map(magnetNodeForNodeBelow);
      }

      let linkData = magnetNodes.map(function makeLink(magnetNode, i) {
        return {
          source: magnetNode,
          target: nodes[i],
          value: 1
        };
      });

      nodes = nodes.concat(magnetNodes);
      nodes.forEach(function setRadius(node) {
        node.radius = node.value / 2;
        node.r = 0;
      });


      let translation;
      if (loc === "above") {
        translation = "translate(" + phaseWidth * moveX + ", 0)";
      } else {
        translation = "translate(" + phaseWidth * moveX + ", " + (phaseHeight + (phaseLabelHeight / 2)) + ")"
      }

      let node = visualization.append("g")
        .attr("transform", translation)
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', function (d) {
          return (d.value / 2) - .75 || 0;
        })
        .style('fill', function (d) {
          return d.color;
        })
        .on("click", function (d) {
          var gap = maxWidth - d3.event.clientX;

          if (gap < tooltipWidth) {
            d3.select(".tooltip")
              .classed("on-left", true);

            tooltip.transition()
              .duration(200)
              .style("opacity", 1)
              .style("display", "block")
              .style("left", d3.event.clientX - (tooltipWidth + (d.value / 2) + 5 * zoom.scale()) + "px")
              .style("top", d3.event.clientY - 120 + "px");
            //.style("left", (15 + 30 + (d.value / 2) + (d.x + (phaseWidth * moveX))) + "px")
            //.style("top", (d.y + 30 - 120) + "px");
          } else {

            d3.select(".tooltip")
              .classed("on-left", false);


            tooltip.transition()
              .duration(200)
              .style("opacity", 1)
              .style("display", "block")
              .style("left", d3.event.clientX + (d.value / 2 + 5 * zoom.scale()) + "px")
              .style("top", d3.event.clientY - 120 + "px");
            //.style("left", (15 + 30 + (d.value / 2) + (d.x + (phaseWidth * moveX))) + "px")
            //.style("top", (d.y + 30 - 120) + "px");
          }

          setTimeout(function () {
            d3.select("body").classed("has-overlay", true);
          }, 0);


          tooltip.append("svg")
            .attr("height", d.value)
            .attr("width", d.value)
            .style("left", -15 - d.value + "px")
            .attr("class", "tooltip-data")
            .append("circle")
            .attr("cx", d.value / 2)
            .attr("cy", d.value / 2)
            .attr('r', (d.value / 2))
            .style('fill', d.color);

          tooltipContent.html(
            "<p class='tooltip-label'>" +
            "<span class='tooltip-label-heading'>Organization</span>" +
            d.organization +
            "</p>" +
            "<p class='tooltip-label'>" +
            "<span class='tooltip-label-heading'>Topic</span>" +
            topicMapping[d.topicId] +
            "</p>" +
            "<p class='tooltip-label'>" +
            "<span class='tooltip-label-heading'>Phase</span>" +
            d.phase +
            "</p>" +
            "<p class='tooltip-label'>" +
            "<span class='tooltip-label-heading'>Documents</span>" +
            d.documents +
            "</p>"
          );

          tooltipArrow.attr("fill", d.color);

        });

      force
        .nodes(nodes)
        .links(linkData)
        .on('tick', tick)
        .start();

      function tick() {
        let q = d3.geom.quadtree(nodes),
          i = 0,
          n = nodes.length;

        while (++i < n) {
          q.visit(collide(nodes[i]));
        }

        node.attr('cx', updateCx)
          .attr('cy', updateCy);
      }

      function collide(node) {
        let r = node.value / 2,
          nx1 = node.x - r,
          nx2 = node.x + r,
          ny1 = node.y - r,
          ny2 = node.y + r;
        return function (quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== node)) {
            let x = node.x - quad.point.x,
              y = node.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = node.radius + quad.point.radius;
            if (!node.fixed && l < r) {
              // The node and the node described by the quad are too close.
              // Push them away from each other.
              l = (l - r) / l * 0.5;
              if (!isFinite(l)) {
                l = 0;
              }
              x *= l;
              y *= l;
              node.x -= x;
              node.y -= y;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        }
      }


    };

    let magnetNodeForNode = function (node) {
      return {
        name: 'magnet',
        group: 100,
        fixed: true,
        // isAMagnet: true,
        x: node.x,
        y: (phaseHeight - (phaseLabelHeight / 2)) + (node.value / 2) + 20
      };
    };

    let magnetNodeForNodeBelow = function (node) {
      return {
        name: 'magnet',
        group: 100,
        fixed: true,
        // isAMagnet: true,
        x: node.x,
        y: 0
      };
    };

    let updateCx = function (d) {
      if (!d.fixed) {
        d.x = Math.max(d.value / 2, Math.min(phaseWidth - (d.value / 2), d.x));
      }
      return d.x;
    };

    let updateCy = function (d) {
      if (!d.fixed) {
        d.y = Math.max(d.value / 2, Math.min((phaseHeight - (phaseLabelHeight / 2)) - (d.value / 2), d.y));
      }
      return d.y;
    };

    let setRandomPositionAtTopOfBounds = function (node) {
      node.x = ~~(Math.random() * phaseWidth);
      node.y = ~~(Math.random() * phaseWidth);
      node.r = 0;
    };

    let findParentNodeUntilClass = function (el, className) {
      while (el) {
        if (el.classList.contains(className)) {
          return el;
        }
        el = el.parentNode;
        if (!el) {
          return null;
        }
      }
    };

    let rebuildChart = function () {
      let selectedData = [];

      _.each(finalData, function (array) {
        let tempArray = [];
        _.filter(array, function (object) {
          if (selectedTopics.length > 0 && selectedTopics.indexOf(object.topicId) === -1) {
            object.color = "#cccccc";
          } else if (selectedOrganization.length > 0 && selectedOrganization.indexOf(object.organization) === -1) {
            object.color = "#cccccc";
          } else {
            object.color = object.originalColor;
          }

          tempArray.push(object);
        });
        selectedData.push(tempArray);
      });

      createVisualization(selectedData);
    };

    let objectMapping = function (data) {
      let mappedData = [];
      _.each(data, function (obj) {
        mappedData.push({
          topicId: obj[0],
          phase: obj[1],
          organization: obj[2],
          documents: obj[3]
        });
      });
      return mappedData;
    };

    let zoomed = function () {
      clearTooltip();
      visualization.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    };

    let buildControls = function (allTopics, allOrgs) {
      let controlsFragment = document.createDocumentFragment();
      let controlsDiv = document.createElement('div');
      controlsDiv.className = "controls";

      controlsDiv.innerHTML = "<a href='#' class='logo'>" +
        "<img src='img/superh-logo.png' alt='Super-H logo'>" +
        "</a>" +
        "<button class='toggle'>" +
        "<svg width='30' height='12' viewBox='0 0 50 20' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>" +
        "<path id='path0_fill' d='M 27.3163 1.75058C 28.2828 3.42461 27.7092 5.56517 26.0352 6.53167L 5.25058 18.5317C 3.57656 19.4982 1.43599 18.9246 0.469495 17.2506C -0.497003 15.5766 0.0765601 13.436 1.75058 12.4695L 22.5352 0.469495C 24.2092 -0.497003 26.3498 0.0765607 27.3163 1.75058Z'/>" +
        "<path id='path1_fill' d='M 21.4694 1.75058C 20.5029 3.42461 21.0765 5.56517 22.7505 6.53167L 43.5351 18.5317C 45.2091 19.4982 47.3497 18.9246 48.3162 17.2506C 49.2827 15.5766 48.7091 13.436 47.0351 12.4695L 26.2505 0.469495C 24.5765 -0.497003 22.4359 0.0765607 21.4694 1.75058Z'/>" +
        "</svg>" +
        "</button>" +
        "<div class='controls-content'>" +
        "<div class='controls-content_group'>" +
        "<span class='controls-label'>Topics</span>" +
        "<div class='dropdown is-topics'>" +
        "<span class='dropdown-selected'>Select a topic</span>" +
        "<button class='dropdown-toggle'>" +
        "<svg width='15' height='6' viewBox='0 0 50 20' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>" +
        "<path id='path0_fill' d='M 27.3163 1.75058C 28.2828 3.42461 27.7092 5.56517 26.0352 6.53167L 5.25058 18.5317C 3.57656 19.4982 1.43599 18.9246 0.469495 17.2506C -0.497003 15.5766 0.0765601 13.436 1.75058 12.4695L 22.5352 0.469495C 24.2092 -0.497003 26.3498 0.0765607 27.3163 1.75058Z'/>" +
        "<path id='path1_fill' d='M 21.4694 1.75058C 20.5029 3.42461 21.0765 5.56517 22.7505 6.53167L 43.5351 18.5317C 45.2091 19.4982 47.3497 18.9246 48.3162 17.2506C 49.2827 15.5766 48.7091 13.436 47.0351 12.4695L 26.2505 0.469495C 24.5765 -0.497003 22.4359 0.0765607 21.4694 1.75058Z'/>" +
        "</svg>" +
        "</button>" +
        "<ul class='dropdown-list dropdown--topics'></ul>" +
        "</div>" +
        "<ul class='dropdown-list--added dropdown-list--topics'></ul>" +
        "</div>" +
        "<div class='controls-content_group'>" +
        "<span class='controls-label'>Organizations</span>" +
        "<div class='dropdown is-organizations'>" +
        "<span class='dropdown-selected'>Select an organization</span>" +
        "<button class='dropdown-toggle'>" +
        "<svg width='15' height='6' viewBox='0 0 50 20' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>" +
        "<path id='path0_fill' d='M 27.3163 1.75058C 28.2828 3.42461 27.7092 5.56517 26.0352 6.53167L 5.25058 18.5317C 3.57656 19.4982 1.43599 18.9246 0.469495 17.2506C -0.497003 15.5766 0.0765601 13.436 1.75058 12.4695L 22.5352 0.469495C 24.2092 -0.497003 26.3498 0.0765607 27.3163 1.75058Z'/>" +
        "<path id='path1_fill' d='M 21.4694 1.75058C 20.5029 3.42461 21.0765 5.56517 22.7505 6.53167L 43.5351 18.5317C 45.2091 19.4982 47.3497 18.9246 48.3162 17.2506C 49.2827 15.5766 48.7091 13.436 47.0351 12.4695L 26.2505 0.469495C 24.5765 -0.497003 22.4359 0.0765607 21.4694 1.75058Z'/>" +
        "</svg>" +
        "</button>" +
        "<ul class='dropdown-list dropdown--organizations'></ul>" +
        "</div>" +
        "<ul class='dropdown-list--added dropdown-list--organizations'></ul>" +
        "</div>" +
        "</div>";

      controlsFragment.appendChild(controlsDiv);

      body.insertBefore(controlsFragment, element);

      topicSelect = document.querySelector('.dropdown--topics');
      topicsAddedList = document.querySelector('.dropdown-list--topics');
      organizationSelect = document.querySelector('.dropdown--organizations');
      organizationsAddedList = document.querySelector('.dropdown-list--organizations');

      buildTopicDropdown(allTopics);

      buildOrganizationDropdown(allOrgs);
    };

    let isDescendant = function (parent, child) {
      let node = child.parentNode;
      while (node != null) {
        if (node == parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    };

    plugin.init();
  };

  $.fn.pbv = function (options) {

    return this.each(function () {
      if (undefined == $(this).data('pbv')) {
        if (options) {
          let plugin = new $.pbv(this, options);
          $(this).data('pbv', plugin);
        }

      }
    });
  };

})(jQuery);
