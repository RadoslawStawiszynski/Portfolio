import tkinter as tk


class Button(tk.Button):
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)
        self.configure(
            relief=tk.RAISED,
            bg="lightgray",
            fg="black",
            font=("Arial", 10),
            padx=9,
            pady=5,
            activebackground="gray",
            activeforeground="white",
        )
