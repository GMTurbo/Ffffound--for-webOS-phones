opus.Gizmo({
	name: "main",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	h: "100%",
	styles: {
		italic: true,
		zIndex: 2
	},
	chrome: [
		{
			name: "scroller1",
			layoutKind: "hbox",
			mode: "horizontal-snap",
			snapElements: "label3,label1,label2",
			scrollPosition: {
				left: -640,
				top: 0
			},
			type: "Palm.Mojo.Scroller",
			l: 0,
			t: 0,
			h: "35",
			styles: {
				cursor: "move",
				overflow: "hidden"
			},
			controls: [
				{
					name: "label3",
					label: "search",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "320",
					t: 0,
					h: "100%",
					styles: {
						italic: true,
						textAlign: "left",
						fontSize: "26px",
						textColor: "white",
						bgColor: "black",
						fontFamily: ""
					}
				},
				{
					name: "label1",
					label: "everyone",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "320",
					t: 0,
					styles: {
						italic: true,
						textAlign: "center",
						bgColor: "black",
						textColor: "white",
						opacity: 1,
						fontSize: "26px",
						fontFamily: ""
					}
				},
				{
					name: "label2",
					label: "author",
					type: "Palm.Mojo.Label",
					l: 640,
					w: "320",
					t: 0,
					h: "100%",
					styles: {
						italic: true,
						textAlign: "right",
						bgColor: "black",
						opacity: 1,
						textColor: "white",
						fontSize: "26px",
						fontFamily: ""
					}
				}
			]
		},
		{
			name: "scroller2",
			layoutKind: "hbox",
			mode: "horizontal-snap",
			snapElements: "searchScroll,mainScroll,userScroll",
			scrollPosition: {
				left: -640,
				top: 0
			},
			type: "Palm.Mojo.Scroller",
			l: 0,
			t: 0,
			h: "100%",
			styles: {
				cursor: "move",
				overflow: "hidden"
			},
			controls: [
				{
					name: "searchScroll",
					scrollPosition: {
						left: 0,
						top: 0
					},
					type: "Palm.Mojo.Scroller",
					l: 0,
					w: "320",
					t: 0,
					h: "100%",
					styles: {
						cursor: "move",
						overflow: "hidden",
						bgImage: "images/ffffoundBR.png",
						bgColor: "white"
					},
					controls: [
						{
							name: "label4",
							label: "",
							type: "Palm.Mojo.Label",
							l: 0,
							t: 0,
							h: "100%",
							styles: {
								opacity: 1
							}
						},
						{
							name: "html5",
							content: "<div class='palm-row'style=\"heigth:60px\">\n    <div class=\"palm-row-wrapper\" style=\"heigth:60px\">\n        <div class=\"textfield-group\" x-mojo-focus-highlight=\"true\" style=\"heigth:60px\">\n            <div class=\"title\">        \n                <div class=\"label1\" style=\"color:white;\"></div>\n                <div id=\"SearchtextField\" x-mojo-element=\"TextField\" style=\"heigth:60px\"></div>\n            </div> \n        </div>\n    </div>\n</div>",
							type: "Palm.Mojo.Html",
							l: 0,
							t: 0,
							b: "0",
							styles: {
								bgColor: "white"
							}
						}
					]
				},
				{
					name: "mainScroll",
					scrollPosition: {
						left: 0,
						top: 0
					},
					type: "Palm.Mojo.Scroller",
					l: 0,
					w: "320",
					t: 0,
					h: "100%",
					styles: {
						cursor: "move",
						overflow: "hidden",
						bgColor: "black",
						opacity: "0.9"
					},
					controls: [
						{
							name: "list1",
							dropTarget: true,
							onhold: "",
							items: [
								{
									item: 0,
									label: "Zero",
									value: "0"
								},
								{
									item: 1,
									label: "One",
									value: "1"
								},
								{
									item: 2,
									label: "Two",
									value: "2"
								},
								{
									item: 3,
									label: "Three",
									value: "3"
								}
							],
							useSampleData: false,
							title: undefined,
							itemHtml: "<div class=\"img-desc\" style=\"background:url(#{background}) center center no-repeat; background-size: 100%;\">\n    <img id=\"image\" src=\"#{image}\" alt=\"\" x-mojo-touch-feedback=\"delayed\"/><cite>#{author}</cite>\n    <span id=\"search\" x-mojo-touch-feedback=\"delayed\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>\n</div>\n",
							onlisttap: "list1Listtap",
							renderLimit: "25",
							lookAhead: "20",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 104
						}
					]
				},
				{
					name: "userScroll",
					scrollPosition: {
						left: 0,
						top: 0
					},
					type: "Palm.Mojo.Scroller",
					l: 0,
					w: "320",
					t: 0,
					h: "100%",
					styles: {
						cursor: "move",
						overflow: "hidden",
						bgColor: "black",
						opacity: "0.9"
					},
					controls: [
						{
							name: "list2",
							dropTarget: true,
							items: [
								{
									item: 0,
									label: "Zero",
									value: "0"
								},
								{
									item: 1,
									label: "One",
									value: "1"
								},
								{
									item: 2,
									label: "Two",
									value: "2"
								},
								{
									item: 3,
									label: "Three",
									value: "3"
								}
							],
							useSampleData: false,
							title: undefined,
							itemHtml: "<div class=\"img-desc\" style=\"background:url(#{background}) center center no-repeat; background-size: 100%;\">\n    <img id=\"image\" src=\"#{image}\" alt=\"\"x-mojo-touch-feedback=\"delayed\"/><cite>#{title}</cite>\n</div>\n",
							onlisttap: "list2Listtap",
							renderLimit: "25",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: "0",
							h: 100
						}
					]
				}
			]
		}
	]
});