const ROWS = 10;
const COLS = 10;
const BOMB_COUNT = 10;

let revealedCount = 0;
let gameOver = false;

let cellsValues = initCellsValues(ROWS, COLS);
let cellsStatus = initCellsStatus(ROWS, COLS);

function initCellsValues(ROWS, COLS){
	
	let cellsValues = [];
	
	for( let i = 0; i < ROWS; i++ ){
		
		let newRow = [];
		
		for( let j = 0; j < COLS; j++ ){
			newRow.push(0);
		}
		
		cellsValues.push(newRow);
		
	}
	
	return cellsValues;
	
}

function initCellsStatus(ROWS, COLS){
	
	let cellsStatus = [];
	
	for( let i = 0; i < ROWS; i++ ){
		
		let newRow = [];
		
		for( let j = 0; j < COLS; j++ ){
			newRow.push('H');
		}
		
		cellsStatus.push(newRow);
		
	}
	
	return cellsStatus;
	
}

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
			/// event listeners
			newCell.addEventListener('click', handleLeftClick);
			newCell.addEventListener('contextmenu', handleRightClick);
			
			newRow.appendChild(newCell);
			
		}
		
		newTable.appendChild(newRow);
		
	}
	
}

function handleLeftClick(event){
	
	const cellElement = event.currentTarget;
	const r = parseInt(cellElement.dataset.row);
	const c = parseInt(cellElement.dataset.col);
	const value = cellElement.dataset.value;
	
	if( gameOver === true ){
		return;
	}
	
	if( cellsStatus[r][c] === 'C' || cellsStatus[r][c] === 'F' ){
		return;
	}
	
	if ( value === '0' ) {
        
        revealAdjacentEmptyCells(r, c, ROWS, COLS, cellsValues, cellsStatus);
        
    } 
	
	else {
		
        cellsStatus[r][c] = 'C';
		revealedCount++;
        revealCell(cellElement); 
    
	}
	
	if (value !== '0') {
        checkWin(revealedCount);
    }
		
}

function handleRightClick(event){
	
	event.preventDefault();
	
	if( gameOver === true ){
		return;
	}	

	const cellElement = event.currentTarget;
	const cellImage = cellElement.querySelector('img');
	
	const r = parseInt(cellElement.dataset.row);
	const c = parseInt(cellElement.dataset.col);
	
	if( cellsStatus[r][c] == 'H' ){
		
		cellImage.src = `flag.png`;
		cellsStatus[r][c] = 'F';
		
	}
	else if( cellsStatus[r][c] == 'F' ){
		cellImage.src = `hidden.png`;
		cellsStatus[r][c] = 'H';
	}
	
}

function revealCell(cellElement) {
	
    const value = cellElement.dataset.value; 
    const cellImage = cellElement.querySelector('img');
	
	if( value == 9 ){
		
		cellImage.src = `bomb.png`;
		gameOver = true;
		console.log("You lose!");
		
	}
	
    else {
		
        cellImage.src = `${value}.png`;
		
    }
	
}

function revealAdjacentEmptyCells(r, c, ROWS, COLS, cellsValues, cellsStatus){
	
	if ( r < 0 || r >= ROWS || c < 0 || c >= COLS ) {
        return;
    }
	
	if ( cellsStatus[r][c] === 'C' || cellsStatus[r][c] === 'F' ) {
        return;
    }
	
	cellsStatus[r][c] = 'C';
	revealedCount++;
	
	const cellElement = document.getElementById(`cell-${r}-${c}`);
	revealCell(cellElement);
	
	if ( cellsValues[r][c] !== 0 ) {
        return;
    }
	
	const neighborOffsets = [
		[-1, -1],[-1, 0], [-1, 1],
        [0, -1],		 [0, 1], 
		[1, -1], [ 1, 0], [1, 1]
    ];
	
	for (const [dr, dc] of neighborOffsets) {
		
        const nextR = r + dr;
        const nextC = c + dc;
		
		///sharp edges fixer:
		
		revealAdjacentEmptyCells(nextR, nextC, ROWS, COLS, cellsValues, cellsStatus);
    
	}
	
}

function checkWin(revealedCount){
	
	if( revealedCount === ROWS * COLS - BOMB_COUNT ){
		
		console.log("You win!");
		gameOver = true;
		return true;
		
	}
	
	return false;
	
}

initialize_table(cellsValues, ROWS, COLS, BOMB_COUNT);

/// check lose & win
/// clean code A LOT
/// organize files
