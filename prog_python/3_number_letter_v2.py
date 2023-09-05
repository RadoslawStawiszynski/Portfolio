import time
import random


# Funkcja do gry "Find a Letter"
def play_letters_game():
    name = input("Enter Your Name: ")
    print("Hello, " + name + "!")
    print("Get ready!!")
    print()
    time.sleep(1)
    print("Let's play 'Find a Letter'!")
    time.sleep(0.5)

    word = random.choice(
        ["Flower", "Python", "Banana", "Puzzle", "Jacket", "Orange", "Guitar", "Rocket", "Elephant", "Umbrella",
         "Diamond", "Calendar", "Mountain", "Keyboard", "Telescope", "Laptop", "Sunglasses", "Scissors", "Microphone"])
    wrd = ''
    chance = 30

    while chance > 0:
        failed = 0
        for char in word:
            if char in wrd:
                print(char, end=' ')
            else:
                print("_", end=' ')
                failed += 1
        print()

        if failed == 0:
            print("You Won!! Congratulations!!")
            break

        guess = input("Guess a Letter: ").strip()
        if len(guess) != 1 or not guess.isalpha():
            print("Invalid input. Please enter a single letter.")
            continue

        wrd += guess
        wrd += guess.swapcase()

        if guess not in word:
            chance -= 1
            print("Wrong Guess! Try Again")
            print("You have", chance, 'more turns')
            if chance == 0:
                print("You Lose! Better Luck Next Time")
    print("\nThe word was:", word)


# Funkcja do gry "Guess the Number"
def play_number_game():
    print("\nWelcome to 'Guess the Number'!")
    print("You have 3 tries to guess a number between 1 and 12. Good luck!")

    number = random.randint(1, 12)
    chances = 3

    while chances > 0:
        guess = input("Enter a number between 1 and 12: ")

        if not guess.isdigit() or not (1 <= int(guess) <= 12):
            print("Invalid input. Please enter a valid number between 1 and 12.")
            continue

        guess = int(guess)

        if guess == number:
            print('Congratulations! You guessed the number!')
            break
        elif guess < number:
            print('Too low. Try again.')
        else:
            print('Too high. Try again.')

        chances -= 1

    if chances == 0:
        print("You've used all your chances. Game over.")
        print(f"The correct number was {number}.")


# Menu główne
def main_menu():
    print("\nWelcome to the Game Menu!")
    print("1. Find a Letter Game")
    print("2. Guess the Number Game")
    print("3. Exit")

    choice = input("Please enter the number of the game you want to play or '3' to exit: ")

    if choice == '1':
        play_letters_game()
    elif choice == '2':
        play_number_game()
    elif choice == '3':
        print("Goodbye!")
        exit()
    else:
        print("Invalid choice. Please select a valid option.")


if __name__ == "__main__":
    while True:
        main_menu()
