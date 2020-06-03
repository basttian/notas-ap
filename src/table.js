
export function myFunction() {

	  // Declare variables
 	var table, inputs, buscar, filter;

	buscar = document.getElementById("buscar");
	filter = buscar.value.toUpperCase();

	table = document.getElementById( 'tabla' );
	inputs = table.querySelectorAll( 'input' );
	var arr = [].slice.call( inputs ).map(function ( node ) {
		return node.value; 
	})
	
	var filas = document.getElementById("tabla").getElementsByTagName("tbody")[0].rows;

	for (let index = 0; index < arr.length; index++) {
		const element = arr[index];
	
		//console.log(element.indexOf(filter) >= 0)

		if ((element.toUpperCase().indexOf(filter) > -1)) {
			filas[index].style.display = "";
		} else {
			filas[index].style.display = "none";
		}

	}



}
