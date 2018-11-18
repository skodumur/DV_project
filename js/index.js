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
//const chart2 = new D3Funnel('#funnel2');
//const checkboxes = [...document.querySelectorAll('input')];
//const color = document.querySelector('[value="color"]');

function onChange() {
    let data = [];

    data = [[
        { label: 'Login', value: 12000 ,  },
        { label: 'Profile', value: 4000, backgroundColor: '#898d8f' },
        { label: 'Products', value: 8000, backgroundColor: '#898d8f' },
        { label: 'Payment', value: 1500, backgroundColor: '#898d8f' },
    ], [
        { label: 'Login', value: 10000, backgroundColor: '#898d8f' },
        { label: 'Profile', value: 7000, backgroundColor: '#898d8f' },
        { label: 'Products', value: 3500 , backgroundColor: '#898d8f'},
        { label: 'Payment', value:1500 , backgroundColor: '#898d8f'},
    ]];

    let options = {
        chart: {
            bottomWidth: 1 / 8,
            width:35,
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
            fontSize: '11px'
        },
        events: {
            click: {
                block(d) {
                    //d.fill.type = "gradient"
                    //debugger;
                    alert(d.label.raw);
                },
            },
        }
    };
	function test(i){
		console.log(i);
	}
	let demo = $( ".demo" );
	for(i in mainPatternData) {
		demo.append( `<div> <i class="fas fa-users pattern-btn" my-val="${i}"></i> <div class='demo-funnel' id='funnel-${i}'>Test</div></div>` );
	}
	$(".pattern-btn").click((evt) => {
        plotStacked(evt.currentTarget.getAttribute('my-val'));
        barchargraph();
	})
		
	$( ".demo-funnel" ).each(function( index ) {
		let curChart  = new D3Funnel(this);
		curChart.draw(mainPatternData[mainPatternData.length - index-1], options);
	});
    // checkboxes.forEach((checkbox) => {
    //     if (checkbox.checked) {
    //         options = _.merge(options, settings[checkbox.value]);
    //     }
    // });

    // Reverse data for inversion
    // if (options.chart.inverted) {
    //     options.chart.bottomWidth = 1 / 3;
    //     data = data.reverse();
    // }

    
	console.log(mainPatternData);
	// var ctx = document.getElementsByClassName("svg-class")[0],
// textElm = ctx.getElementsByClassName("svg-text")[0],
// SVGRect = textElm.getBBox();

// var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    // rect.setAttribute("x", SVGRect.x);
    // rect.setAttribute("y", SVGRect.y);
    // rect.setAttribute("width", SVGRect.width);
    // rect.setAttribute("height", SVGRect.height);
    // rect.setAttribute("fill", "yellow");
    // ctx.insertBefore(rect, textElm);
}
onChange();

// Bind event listeners
// checkboxes.forEach((checkbox) => {
//     checkbox.addEventListener('change', onChange);
// });

// Trigger change event for initial render
//checkboxes[0].dispatchEvent(new CustomEvent('change'));
