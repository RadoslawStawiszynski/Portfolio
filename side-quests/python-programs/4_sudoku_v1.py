import random
import time

def generate_sudoku():
    try:
        # Tworzenie planszy 9x9 w postaci listy dwuwymiarowej
        sudoku_board = [[0 for _ in range(9)] for _ in range(9)]

        # Wypełnianie planszy liczbami Sudoku
        for _ in range(15):  # Ilość liczb na planszy
            row, col, num = random.randint(0, 8), random.randint(0, 8), random.randint(1, 9)
            while not is_valid_move(sudoku_board, row, col, num):
                row, col, num = random.randint(0, 8), random.randint(0, 8), random.randint(1, 9)
            sudoku_board[row][col] = num

        return sudoku_board
    except KeyboardInterrupt:
        print("\nGenerowanie przerwane przez użytkownika.")
        return None
    except Exception as e:
        print("\nWystąpił błąd podczas generowania planszy:", str(e))
        return None


def is_valid_move(board, row, col, num):
    # Sprawdzenie, czy num może być umieszczony w danej pozycji
    for i in range(9):
        if board[row][i] == num or board[i][col] == num:
            return False

    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False

    return True


def print_board(bo):
    try:
        for i in range(len(bo)):
            if i % 3 == 0 and i != 0:
                print("-" * 23)  # Linia pozioma oddzielająca sekcje 3x3
            for j in range(len(bo[0])):
                if j % 3 == 0 and j != 0:
                    print(" | ", end="")
                if j == 8:
                    print((bo[i][j]) if bo[i][j] != 0 else ".", end="\n")
                    time.sleep(0.01)
                else:
                    print(str(bo[i][j]) if bo[i][j] != 0 else ".", end=" ")
                    time.sleep(0.01)

                # Opóźnienie drukowania
                time.sleep(0.04)

    except KeyboardInterrupt:
        print("\nDrukowanie przerwane przez użytkownika.")
    except Exception as e:
        print("\nWystąpił błąd podczas drukowania planszy:", str(e))


def find_empty(bo):
    for i in range(len(bo)):
        for j in range(len(bo[0])):
            if bo[i][j] == 0:
                return i, j
    return None


def valid(bo, num, pos):
    for i in range(len(bo[0])):  # checking row
        if bo[pos[0]][i] == num and pos[1] != i:
            return False
    for j in range(len(bo)):  # checking column
        if bo[j][pos[1]] == num and pos[0] != j:
            return False
    box_x = pos[1] // 3
    box_y = pos[0] // 3
    for i in range(box_y * 3, box_y * 3 + 3):
        for j in range(box_x * 3, box_x * 3 + 3):
            if bo[i][j] == num and (i, j) != pos:
                return False
    return True


def solve(bo):
    try:
        find = find_empty(bo)
        if find:
            row, col = find
        else:
            return True
        for i in range(1, 10):
            if valid(bo, i, (row, col)):
                bo[row][col] = i
                if solve(bo):
                    return True
                bo[row][col] = 0
        return False
    except KeyboardInterrupt:
        print("\nRozwiązywanie przerwane przez użytkownika.")
    except Exception as e:
        print("\nWystąpił błąd podczas rozwiązywania Sudoku:", str(e))


sudoku_board = generate_sudoku()
if not sudoku_board:
    pass
else:
    print("Generated Sudoku:")
    print_board(sudoku_board)
    solve(sudoku_board)
    print("\nSolving...")
    print_board(sudoku_board)
    print("\nSolved!")
