export type NodeType = {
	imageUrl: string; // link to the image
	firstName: String;
	lastName: String;
	// distance from us to this node -> see additional Questions, there is a question for this
	distance: Number;
	price: Number; // price of the trade
	lat: string;
	long: string;
	strategy: string;
	connectedNodes?: NodeType[];
};
