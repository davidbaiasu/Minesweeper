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

function initialize_table(cellsValues, ROWS, COLS, BOMB_COUNT){
	
	cellsValues = initialize_cellsValues(cellsValues, ROWS, COLS, BOMB_COUNT);
	
	const newTable = document.getElementById('grid');
	newTable.innerHTML = ''
	
	let i, j;
	
	for( i = 0; i < ROWS; i++ ){
		
		const newRow = document.createElement('tr');
		
		for( j = 0; j < COLS; j++ ){
			
			const newCell = document.createElement('td');
			
			newCell.dataset.value = cellsValues[i][j];
            newCell.dataset.row = i;
            newCell.dataset.col = j;
			newCell.classList.add('cell');
			
			const cellImage = document.createElement('img');
			cellImage.src = 'hidden.png';
			cellImage.id = `img-${i}-${j}`;
			newCell.appendChild(cellImage);
			
			newCell.id = `cell-${i}-${j}`;
			
			newRow.appendChild(newCell);
			
		}
		
		newTable.appendChild(newRow);
		
	}
	
}

initialize_table(cellsValues, ROWS, COLS, BOMB_COUNT);
