import tkinter as tk
from tkinter import messagebox
from utils.validation import validate_data

class EntryField(tk.Entry):
    def __init__(self, master, field_type=None, **kwargs):
        super().__init__(master, **kwargs)
        self.configure(bg="white")
        self.valid = False
        self.field_type = field_type
        self.bind("<FocusIn>", self.on_focus_in)
        self.bind("<FocusOut>", self.on_focus_out)

    def on_focus_in(self, event):
        self.configure(bg="light gray")

    def on_focus_out(self, event):
        self.configure(bg="white")
        self.valid = validate_data(self.get(), self.field_type)
