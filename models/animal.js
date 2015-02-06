/**
 * @file Defines the animal resource model
 * @author Tom Jenkins tom@itsravenous.com
 */

var Animal = function () {
	
}

Animal.prototype = {
	
	toJSON: function () {
		var resource = {
			id: this.id,
			name: this.name
		};
		return JSON.stringify(resource);
	}

}