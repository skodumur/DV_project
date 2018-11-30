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
for (let prop in colorCode) {
    console.log(prop, colorCode[prop]);
    $('.legend').append(`<div class="foo" style = "background: ${colorCode[prop]}"></div><h6>${prop}</h6>`)
}

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

function onChange(category, index) {
    //d3.select("#stacked").selectAll("*").remove();
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
                        $('.menu-option').on('click', () => {
                            let index = parseInt($(e.target).parents('.demo-funnel').attr('id').split('-')[1]);
                            onChange(d.label.raw, index);
                        })
                        setPosition(origin);
                        return false;
                }
            }
        }
    };

	let demo = $( ".demo" );
	for(i in mainPatternData) {
		demo.append( `<div> <i class="fa fa-users pattern-btn" my-val="${mainPatternData.length - i-1}"></i> <div class='demo-funnel' id='funnel-${mainPatternData.length - i-1}'>Test</div></div>` );
	}
	$(".pattern-btn").click((evt) => {
        selectedIndex = evt.currentTarget.getAttribute('my-val');
        if(detailedView == 0)
            plotStacked(selectedIndex)
        // plotStacked(selectedIndex, false, false, false, 'electronics')
        if(detailedView == 1)
             plotOverviewGraph(selectedIndex);
        $('.legend').css('display', 'block')
	})
    
	$( ".demo-funnel" ).each(function( index ) {
		let curChart  = new D3Funnel(this);
        curChart.draw(mainPatternData[mainPatternData.length - index-1], options);
        if(index == 5) {
            let context = new D3Funnel(".context");
            context.draw(mainPatternData[mainPatternData.length - index-1], options);
        }
	});
}
function highlightEvent(evt) {
    isHighlight = evt.target.checked;
    plotStacked(selectedIndex, isHighlight)
}

function renderOverview(){
    d3.select("#stacked").selectAll("*").remove();
    d3.select("#barChart").selectAll("*").remove();
    if(detailedView == 1)
        detailedView = 0;
    else
        detailedView = 1;
    console.log("check")
}
$(function() {
    onChange();
});
