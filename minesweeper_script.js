const ROWS = 8;
const COLS = 8;
const BOMB_COUNT = 10;

let cellsValues = [ 
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0]
]

let cellsStatus = [ /// 'H' = Hidden, 'C' = Clicked, 'F' = Flagged
	['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
	['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
	['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
	['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
	['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
	['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
	['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
	['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
]

function shuffleCoordinates(coordinates) {
	
    let currentIndex = coordinates.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [coordinates[currentIndex], coordinates[randomIndex]] = [
            coordinates[randomIndex], coordinates[currentIndex]
        ];
    }
    return coordinates;
	
}

function initialize_cellsValues(cellsValues, ROWS, COLS, BOMB_COUNT){
	
	let i, j;
	
	/// initialize coordinates matrix
	let coordinates = [];
	
	for( i = 0; i < ROWS; i++ ){
		for( j = 0; j < COLS; j++ ){
			coordinates.push([i, j]);
		}
	}
	
	/// shuffle coordinates
	coordinates = shuffleCoordinates(coordinates, COLS);
	
	/// place bombs
	const bombLocations = coordinates.slice(0, BOMB_COUNT);
	
	for( const [row, col] of bombLocations ){
		cellsValues[row][col] = 9;
	}
	
	/// increase adjacent cell
	const neighborOffsets = [
        [-1, -1], [-1, 0], [-1, 1], 
        [ 0, -1],          [ 0, 1], 
        [ 1, -1], [ 1, 0], [ 1, 1]  
    ];
	
	for( const [row, col] of bombLocations ){
		
		neighborOffsets.forEach(([dr, dc]) => {
            const neighborR = row + dr;
            const neighborC = col + dc;
                    
            if (neighborR >= 0 && neighborR < ROWS &&
					neighborC >= 0 && neighborC < COLS &&
						cellsValues[neighborR][neighborC] !== 9){
							
					cellsValues[neighborR][neighborC] += 1;
					
						}
				
        });
	
	}
	
	return cellsValues;
	
}

function initialize_table(ROWS, COLS, cellsValues){
	
	const newTable = document.getElementById('grid');
	
	let i, j;
	
	for( i = 0; i < ROWS; i++ ){
		
		const newRow = document.createElement('tr');
		
		for( j = 0; j < COLS; j++ ){
			
			const newCell = document.createElement('td');
			
			newCell.textContent = cellsValues[i][j];
			newCell.id = `cell-${i}-${j}`;
			newCell.classList.add('cell');
			
			newRow.appendChild(newCell);
			
		}
		
		newTable.appendChild(newRow);
		
	}
	
}
cellsValues = initialize_cellsValues(cellsValues, ROWS, COLS, BOMB_COUNT);

initialize_table(ROWS, COLS, cellsValues);
