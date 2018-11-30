const colorCode = {
	"accessories": "#DBDB8D",
	"automotive": "#FFFF38",
	"books": "#FF9896",
	"clothing": "#38b0b0",
	"computers": "#98DF8A",
	"electronics": "#C5B0D5",
	"games": "#AEC7E8",
	"grocery": "#F7B6D2",
	"handbags": "#FFBB78",
	"home": "#cd0000bf",
	"movies": "#808000",
	"outdoors": "#483D8B",
	"shoes": "#229f3dbf"
}
let detailedView = 0;
let selectedIndex = -1;
let isHighlight = false;
let clickedLabel;
let clickedSegment;
let isDetailed = false;
for (let prop in colorCode) {
    $('.legend').append(`<div class="foo" style = "background: ${colorCode[prop]}"></div><h6>${prop}</h6>`)
}

const settings = {
    curved: {
        chart: {
            curve: {
                enabled: true,
            },
        },
    },
    pinched: {
        chart: {
            bottomPinch: 1,
        },
    },
    gradient: {
        block: {
            fill: {
                type: 'gradient',
            },
        },
    },
    inverted: {
        chart: {
            inverted: true,
        },
    },
    hover: {
        block: {
            highlight: true,
        },
    },
    tooltip: {
        tooltip: {
            enabled: true,
        },
    },
    click: {
        events: {
            click: {
                block(d) {
                    alert(d.label.raw);
                },
            },
        },
    },
    dynamicHeight: {
        block: {
            dynamicHeight: true,
        },
    },
    barOverlay: {
        block: {
            barOverlay: true,
        },
    },
    animation: {
        chart: {
            animate: 200,
        },
    },
    label: {
        label: {
            fill: 'black',
            fontSize: '11px'
        },
    },
};
const chart = new D3Funnel('#funnel');
function clearAll() {
    d3.select("#stacked").selectAll("*").remove();
    d3.select("#barChart").selectAll("*").remove();
    d3.select("#context").selectAll("*").remove();
    d3.select("#funnel").selectAll("*").remove();
}
function onChange(contextCategory, contextIndex) {
    clearAll();
    let options = {
        chart: {
            bottomWidth: 1 / 8,
            width:45,
            height:700
        },
        block: {
            highlight: true,
            dynamicHeight: true,
            dynamicSlope: true
        },
        label: {
            format: '{l}',
            fill: 'black',
            fontSize: '9px'
        },
        events: {
            click: {
                block(d) {
                    clickedSegment = d.label.raw;
                    plotStacked(selectedIndex, isHighlight, clickedLabel, clickedSegment);
                },
            },
            lableClick: {
                myFun(d) {
                    clickedLable = d;
                    plotStacked(selectedIndex, isHighlight, clickedLable);
                }
            },
            segmentClick: {
                mySegmentClick(d,num, v, e) {
                        e.preventDefault();
                        const origin = {
                          left: e.pageX,
                          top: e.pageY
                        };
                        contextCategory = d.label.raw;
                        contextIndex = parseInt($(e.target).parents('.demo-funnel').attr('id').split('-')[1])
                        setPosition(origin);
                        return false;
                }
            }
        }
    };
    $('.menu-option').on('click', (e) => {
        onChange(contextCategory, contextIndex);
    })
    let demo = $( "#funnel" );
    let filtered = [];
	for(let i = mainPatternData.length-1; i>-1; i--) {
        let curData = mainPatternData[i];
        if (!contextIndex || canInclude(contextCategory, curData)) {
            filtered.push(i);
        }
    }
    _.each(filtered, (i) => {
        demo.append( `<div> <i class="fa fa-users pattern-btn" my-val="${i}"></i> <div class='demo-funnel' id='funnel-${i}'>Test</div></div>` );
    })
    _.each(filtered, (i) => {
        let curChart  = new D3Funnel(`#funnel-${i}`);
        curChart.draw(mainPatternData[i], options);
    })
    if (contextIndex) {
        let context = new D3Funnel("#context");
        $('context').append('<i class="fa fa-users context-icon" ></i>');
            context.draw(mainPatternData[contextIndex], options); 
    }
 	$(".pattern-btn").click((evt) => {
        selectedIndex = evt.currentTarget.getAttribute('my-val');
        if (isDetailed) {
            plotStacked(selectedIndex, isHighlight)
        } else {
            plotOverviewGraph(selectedIndex);
        }
        $('.legend').css('display', 'block')
	})

const menu = document.querySelector(".menu");
let menuVisible = false;

const toggleMenu = command => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};

const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};

window.addEventListener("click", e => {
  if(menuVisible)toggleMenu("hide");
});


}

function canInclude(contextCategory, curData){
   return  _.findIndex(curData, { 'label': contextCategory}) > -1;
}

function highlightEvent(evt) {
    isHighlight = evt.target.checked;
    plotStacked(selectedIndex, isHighlight)
}

function renderOverview(evt){
    d3.select("#stacked").selectAll("*").remove();
    d3.select("#barChart").selectAll("*").remove();
    if (evt.target.checked) {
        isDetailed = true;
        plotStacked(selectedIndex, isHighlight)
    } else {
        isDetailed = false;
        plotOverviewGraph(selectedIndex);
    }

}

$(function() {
    onChange();
});

function updateFilter(evt) {
    if (evt.target.value == 1) {
        $('#browser').removeClass('hide');
        $('#location').addClass('hide');
    } else if (evt.target.value == 2) {
        $('#browser').addClass('hide');
        $('#location').removeClass('hide');
    } else {
        $('#browser').addClass('hide');
        $('#location').addClass('hide');
    }
}