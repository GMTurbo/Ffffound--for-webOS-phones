opus.Gizmo({
	name: "fullView",
	layoutKind: "absolute",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	h: "100%",
	styles: {
		zIndex: 2,
		bgColor: "black"
	},
	chrome: [
		{
			name: "imageView1",
			ontap: "",
			onhold: "imageView1Hold",
			onImageViewChanged: "imageView1ImageViewChanged",
			type: "Palm.Mojo.ImageView",
			l: 0,
			t: 0,
			styles: {
				bgImage: "",
				bgColor: "black",
				opacity: "1"
			}
		}
	]
});