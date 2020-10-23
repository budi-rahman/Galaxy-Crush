/** GALAXY CRUSH
 *  ********************************************************************************************
 *  *       _________       ________                 ________                                  *
 *  *     //         \\    //      \\   ||         //        \\   \\       //   \\      //     *
 *  *     ||              //        \\  ||        //          \\   \\     //     \\    //      *
 *  *     ||      _____   ||_________|| ||        ||___________||   \\___//       \\__//       *
 *  *     ||         ||   ||         || ||        ||           ||   //    \\        ||         *
 *  *     \\_________//   ||         || ||_______ ||           ||  //      \\       ||         *
 *  *                                                                                          *
 *  *       ________      _________                      ________                              *
 *  *     //        \\    ||       \\   ||         ||  //        \\   ||     ||                *
 *  *     ||        ||    ||        ||  ||         ||  ||         ||  ||     ||                *
 *  *     ||              ||        ||  ||         ||  ||             ||_____||                *
 *  *     ||              ||________//  ||         ||  ||             ||     ||                *
 *  *     ||        ||    ||        \\   \\       //   ||        ||   ||     ||                *
 *  *      \\_______//    ||         \\   \\_____//     \\_______//   ||     ||                *
 *  *                                                                                          *
 *  ********************************************************************************************
 * 
 * 
 * 
 * PLAN B FOR FINAL PROJECT
 * 1. Kumpulkan gambar-gambar yang dibuat untuk menjadi objectnya, search juga gambar untuk menjadi background.
 * 2. Siapkan beberapa DOM dan Built-In Function yang dibutuhkan, dicari dan yang sudah dipelajari untuk project ini.
 *    - document.addEventListener()         - .forEach()
 *    - document.querySelector()            - .setAtribute()
 *    - document.getElementById()           - .appendChild()
 *    - document.createElement()            - .addEventListener()
 *    - .includes()                         - .every()
 *    - .setInterval()                      - dll yang ada tambahan
 * 3. buat papan main dengan sekian dan kotak-kotak dalam papan dengan ukuran panjang * lebarnya harus sama
 * 4. tampung dulu deh objectnya.
 * 5. geser-geser object yang ada di papan, jika baris atau kolomnya terkumpul minimal 3 object dan maksimal 4 object
 *    maka object yang terkumpul akan hancur.
 * 6. prioritas yang hancur jika object baris dan object kolom sama berdekatan, dan satu objectnya dipindahkan diantara itu
 *    maka yang hancur adalah object yang terkumpul secara horizontal (belum bisa bersamaan).
 * 7. jika object yang hancur sebanyak 3 maka score bertambah 3 dan jika object yang hancur sebanyak 4 maka score bertambah 4.
 */



document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const width = 8
    const squares = []
    let score = 0
    
  //gambar object-objectnya dulu, gambar sendiri pokoknya  
    const objColors = [
        'url(images/red-meteor.png)',
        'url(images/yellow-star.png)',
        'url(images/orange-planet.png)',
        'url(images/white-rocket.png)',
        'url(images/green-alien.png)',
        'url(images/blue-ufo.png)'
      ]
    
    
    //object siap, buat papan mainnya, object yang turun ke papan dibuat random
    function createBoard() {
      for (let i = 0; i < width*width; i++) {
        const square = document.createElement('div')
        square.setAttribute('draggable', true)
        square.setAttribute('id', i)
        let randomColor = Math.floor(Math.random() * objColors.length)
        square.style.backgroundImage = objColors[randomColor]
        grid.appendChild(square)
        squares.push(square)
      }
    }
    createBoard()
    
    // Fungsi-fungsi penting dalam permainan. untuk menggeser, menyimpan, ngehancurin dan muncul object
    let colorBeingDragged
    let colorBeingReplaced
    let squareIdBeingDragged
    let squareIdBeingReplaced
    
    squares.forEach(square => square.addEventListener('dragstart', dragStart))
    squares.forEach(square => square.addEventListener('dragend', dragEnd))
    squares.forEach(square => square.addEventListener('dragover', dragOver))
    squares.forEach(square => square.addEventListener('dragenter', dragEnter))
    squares.forEach(square => square.addEventListener('drageleave', dragLeave))
    squares.forEach(square => square.addEventListener('drop', dragDrop))
    
    function dragStart(){
        colorBeingDragged = this.style.backgroundImage
        squareIdBeingDragged = parseInt(this.id)
        // this.style.backgroundImage = ''
    }
    
    function dragOver(e) {
        e.preventDefault()
    }
    
    function dragEnter(e) {
        e.preventDefault()
    }
    
    function dragLeave() {
        this.style.backgroundImage = ''
    }
    
    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage
        squareIdBeingReplaced = parseInt(this.id)
        this.style.backgroundImage = colorBeingDragged
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
    }
    
    function dragEnd() {
        //What is a valid move?
        let validMoves = [squareIdBeingDragged -1 , squareIdBeingDragged -width, squareIdBeingDragged +1, squareIdBeingDragged +width]
        let validMove = validMoves.includes(squareIdBeingReplaced)
    
        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null
        }  else if (squareIdBeingReplaced && !validMove) {
           squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
           squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
        } else  squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
    }
    
    //hancurin object, cari yang sama gambarnya, maksimal 4 gambar hancur.
    function moveIntoSquareBelow() {
        for (i = 0; i < 55; i ++) {
            if(squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
                squares[i].style.backgroundImage = ''
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
                const isFirstRow = firstRow.includes(i)
                if (isFirstRow && (squares[i].style.backgroundImage === '')) {
                  let randomColor = Math.floor(Math.random() * objColors.length)
                  squares[i].style.backgroundImage = objColors[randomColor]
                }
            }
        }
    }
    
    
    ///bisa ganti sih disini kalau mau lima object hancur.
    //tampilin juga score kalo object yang hancur 4 ya score tambah 4.
      function checkRowForFour() {
        for (i = 0; i < 60; i ++) {
          let rowOfFour = [i, i+1, i+2, i+3]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
          if (notValid.includes(i)) continue
    
          if(rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 4
            scoreDisplay.innerHTML = score
            rowOfFour.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
      checkRowForFour()
    
    // berdasarkan baris gambar akan hancur, prioritas baris dulu yang hancur kalo object sama baris dan kolom.
      function checkColumnForFour() {
        for (i = 0; i < 39; i ++) {
          let columnOfFour = [i, i+width, i+width*2, i+width*3]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          if(columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 4
            scoreDisplay.innerHTML = score
            columnOfFour.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
    checkColumnForFour()
    
      //minimalnya 3 yang hancur, prioritas yang baris dulu atau yang horizontal.
      function checkRowForThree() {
        for (i = 0; i < 61; i ++) {
          let rowOfThree = [i, i+1, i+2]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
          if (notValid.includes(i)) continue
    
          if(rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 3
            scoreDisplay.innerHTML = score
            rowOfThree.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
      checkRowForThree()
    
    //kalo object letter L dengan jumlah 2 vertikal 2 horizontal berdekatan, terus object dipidahkan ke tengahnya
    //yang hancur prioritas yang horizontal, belum bisa bersamaan.
      function checkColumnForThree() {
        for (i = 0; i < 47; i ++) {
          let columnOfThree = [i, i+width, i+width*2]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          if(columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 3
            scoreDisplay.innerHTML = score
            columnOfThree.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
    checkColumnForThree()
    
    // Cekcekceck
    window.setInterval(function(){
        checkRowForFour()
        checkColumnForFour()
        checkRowForThree()
        checkColumnForThree()
        moveIntoSquareBelow()
      }, 100);
    })
    