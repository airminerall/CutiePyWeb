let authState = {
    isLoggedIn: false,
    user: null,
    currentMode: 'login'
};

const lessonsData = {
    1: { title: "Lesson 1: Hello World", subtitle: "Your first step into the world of Python.", videoUrl: "https://drive.google.com/file/d/1MVP8iNLR1Swj7olpYUM8Pii4sbSoKkuT/view?usp=sharing", breadcrumb: "Lesson 1", badge: "Module 1", theoryTitle: "Introduction to Print", theoryDesc: "Welcome to CutiePy. In this lesson, we will learn how to communicate with the print() function. It is the most basic yet powerful tool in your toolkit.", keyPoints: ["print() displays text and values on the screen", "Strings are wrapped in quotes '...' or \"...\"", "Code runs line by line, from top to bottom", "Comments start with # and are not executed"], syntax: 'print("Hello, CutiePy!")', defaultCode: 'print("Hello, CutiePy!")', challengeTask: "Write a Python script that calculates 5 + 5 and prints the result to the console.", challengeHint: "You can place mathematical operations directly inside the print() function, like this: print(2 + 2)", expectedResult: "10" },
    2: { title: "Lesson 2: Variables", subtitle: "Storing and managing data in Python.", videoUrl: "https://drive.google.com/file/d/1IzD_RiuXV7OSQ50mprDc8HIvlZkSvfFV/view?usp=sharing", breadcrumb: "Lesson 2", badge: "Module 2", theoryTitle: "Assigning Variables", theoryDesc: "Variables are containers for storing data values. In Python, a variable is created the moment you first assign a value to it using the equals sign.", keyPoints: ["A variable is a storage box for data", "Syntax: variable_name = value", "Basic data types: int, float, str, bool", "Variable names cannot start with a number or contain spaces", "Python is dynamically typed, so you do not need to declare a type"], syntax: 'name = "CutiePy"\nprint(name)', defaultCode: 'x = 10\ny = 20\nprint(x + y)', challengeTask: "Create two variables a = 15 and b = 25, then print their sum.", challengeHint: "Assign numbers to variables and print their sum: a = 5; b = 5; print(a + b)", expectedResult: "40" },
    3: { title: "Lesson 3: Loops", subtitle: "Automating repetitive workflows.", videoUrl: "https://drive.google.com/file/d/1oDuoSsANgebv-WWPjb6WBhmcnjGKmydY/view?usp=sharing", breadcrumb: "Lesson 3", badge: "Module 3", theoryTitle: "For Loops", theoryDesc: "Loops allow you to run a block of code multiple times. A for loop in Python is used for iterating over a sequence.", syntax: 'for i in range(3):\n    print(i)', defaultCode: 'for i in range(3):\n    print(i)', challengeTask: "Write a loop that iterates 3 times using range(3) and prints each number.", challengeHint: "Use: for i in range(3): print(i)", expectedResult: "0\n1\n2" },
    4: { title: "Lesson 4: Functions", subtitle: "Structuring modular logic blocks.", videoUrl: "https://drive.google.com/file/d/1m60O7RcuuER8lOQKKUDYki1DbcrPK07o/view?usp=sharing", breadcrumb: "Lesson 4", badge: "Module 4", theoryTitle: "Defining Functions", theoryDesc: "A function is a block of code which only runs when it is called. You can pass data, known as parameters, into a function.", syntax: 'def greet():\n    print("Hello")', defaultCode: 'def say_hello():\n    print("Python is fun")\n\nsay_hello()', challengeTask: "Define a function named run() that prints 'Active' and call it.", challengeHint: "def run():\n    print('Active')\nrun()", expectedResult: "Active" },
        5: { title: "Lesson 5: Objects", subtitle: "Advanced object-oriented programming.", videoUrl: "https://drive.google.com/file/d/1YxBGd2HwBWMCMglOHG-FAT7J1TSZK3Uv/view?usp=sharing", breadcrumb: "Lesson 5", badge: "Module 5", theoryTitle: "Classes & Objects", theoryDesc: "Python is an object-oriented programming language. Almost everything in Python is an object, with its properties and methods.", syntax: 'class Code:\n    pass', defaultCode: 'class Python:\n    version = "3.12"\n\nprint(Python.version)', challengeTask: "Create a class named Bot with a property status = 'Online', and print Bot.status.", challengeHint: "class Bot:\n    status = 'Online'\nprint(Bot.status)", expectedResult: "Online" },
    6: { title: "Lesson 6: Conditionals", subtitle: "Make decisions with if, elif, and else.", videoUrl: "https://drive.google.com/file/d/1de4vYQcSR4sm5QaComB9OtaPl0AGdB0R/view?usp=sharing", breadcrumb: "Lesson 6", badge: "Module 6", theoryTitle: "Conditional Logic", theoryDesc: "Conditional statements let your program choose what to do based on a value or comparison. They are the foundation of decision-making in Python.", syntax: 'score = 80\nif score >= 60:\n    print("Pass")', defaultCode: 'score = 80\nif score >= 60:\n    print("Pass")', challengeTask: "Print 'Pass' from a condition that checks whether score = 75 is greater than or equal to 60.", challengeHint: "score = 75\nif score >= 60:\n    print('Pass')", expectedResult: "Pass" },
    7: { title: "Lesson 7: Lists", subtitle: "Store and process collections of values.", videoUrl: "https://drive.google.com/file/d/1vuNNGAHGnrIwK0ONQKNvOrz4PeZ8OTQz/view?usp=sharing", breadcrumb: "Lesson 7", badge: "Module 7", theoryTitle: "Working with Lists", theoryDesc: "Lists keep multiple values in one ordered collection. You can access items by index, add new values, and loop through the collection.", syntax: 'colors = ["red", "blue"]\nprint(colors[0])', defaultCode: 'numbers = [1, 2, 3]\nprint(numbers[1])', challengeTask: "Create a list containing 10, 20, and 30, then print the second item.", challengeHint: "numbers = [10, 20, 30]\nprint(numbers[1])", expectedResult: "20" },
    8: { title: "Lesson 8: Dictionaries", subtitle: "Organize data with key-value pairs.", videoUrl: "https://drive.google.com/file/d/1vz1yViSLCzK6UclpmpzbBPlBD035eZV-/view?usp=sharing", breadcrumb: "Lesson 8", badge: "Module 8", theoryTitle: "Dictionaries & Sets", theoryDesc: "Dictionaries store values under readable keys, making structured data easy to access. Sets help you work with unique values.", syntax: 'user = {"name": "Ada"}\nprint(user["name"])', defaultCode: 'profile = {"role": "Student"}\nprint(profile["role"])', challengeTask: "Create a dictionary with a city key containing 'Jakarta', then print its value.", challengeHint: "place = {'city': 'Jakarta'}\nprint(place['city'])", expectedResult: "Jakarta" },
    9: { title: "Lesson 9: Error Handling", subtitle: "Write programs that handle mistakes gracefully.", videoUrl: "https://drive.google.com/file/d/1kF786Uf-R8ud1kx4ofRDGJn3DgK7trf0/view?usp=sharing", breadcrumb: "Lesson 9", badge: "Module 9", theoryTitle: "Try & Except", theoryDesc: "Errors can happen while a program runs. try and except blocks let you respond to expected problems without stopping the entire program.", syntax: 'try:\n    value = int("10")\nexcept ValueError:\n    print("Invalid")', defaultCode: 'try:\n    print("Safe")\nexcept:\n    print("Error")', challengeTask: "Write a try block that prints 'Safe' and an except block for errors.", challengeHint: "try:\n    print('Safe')\nexcept:\n    print('Error')", expectedResult: "Safe" },
    10: { title: "Lesson 10: Mini Project", subtitle: "Combine your skills in a practical program.", videoUrl: "https://drive.google.com/file/d/1YZIZ-qELFS4UsqgK8C07lfsao2oWMy7q/view?usp=sharing", breadcrumb: "Lesson 10", badge: "Module 10", theoryTitle: "Build a Small Program", theoryDesc: "A mini project combines variables, conditions, functions, and data structures. Use this module to turn separate skills into a complete solution.", syntax: 'def greet(name):\n    return "Hello " + name', defaultCode: 'name = "Python"\nprint("Hello " + name)', challengeTask: "Create a variable named language with the value 'Python', then print 'I love Python'.", challengeHint: "language = 'Python'\nprint('I love ' + language)", expectedResult: "I love Python" },
    11: { title: "Lesson 11: Modules", subtitle: "Organize code into reusable files.", videoUrl: "https://drive.google.com/file/d/1gbsunlqDwgOTgxRBiZL8L_5edussbY0Y/view?usp=sharing", breadcrumb: "Lesson 11", badge: "Module 11", theoryTitle: "Importing Modules", theoryDesc: "Modules help you organize related code and reuse it across programs. Python includes many useful modules that you can import when needed.", syntax: 'import math\nprint(math.sqrt(16))', defaultCode: 'import math\nprint(math.sqrt(16))', challengeTask: "Import the math module and print the square root of 25.", challengeHint: "import math\nprint(math.sqrt(25))", expectedResult: "5.0" },
    12: { title: "Lesson 12: Final Project", subtitle: "Bring your Python skills together.", videoUrl: "https://drive.google.com/file/d/1AfCT_tGpUHsXVQduN97tJhtxrgrH1uCo/view?usp=sharing", breadcrumb: "Lesson 12", badge: "Module 12", theoryTitle: "Your Python Toolkit", theoryDesc: "You have learned the foundations of Python. Combine your skills to make a small program that is clear, useful, and uniquely yours.", syntax: 'tasks = ["learn", "build"]\nprint(len(tasks))', defaultCode: 'tasks = ["learn", "build"]\nprint(len(tasks))', challengeTask: "Create a list named skills with 'Python' and 'Logic', then print its length.", challengeHint: "skills = ['Python', 'Logic']\nprint(len(skills))", expectedResult: "2" }
};

lessonsData[3].keyPoints = ["for repeats a block of code multiple times", "range(n) generates numbers from 0 to n-1", "You can loop directly over a list or string's elements", "Indentation defines which code belongs to the loop"];
lessonsData[4].keyPoints = ["A function is a reusable block of code", "Syntax: def function_name(parameter):", "return sends a value back from the function", "Parameters are names in a function definition; arguments are values passed when calling it"];
lessonsData[5].keyPoints = ["A class is a blueprint for creating objects", "An object is an instance of a class", "__init__ runs the initial setup of an object", "Attributes are data, and methods are functions belonging to an object"];
lessonsData[6].keyPoints = ["if, elif, and else are used for decision-making", "Comparison operators include ==, !=, >, <, >=, and <=", "Logical operators include and, or, and not", "Conditions evaluate to True or False"];
lessonsData[7].keyPoints = ["A list is an ordered collection of data, written with [ ]", "Indexing starts at 0", "Common methods include append(), remove(), sort(), and len()", "Lists are mutable"];
lessonsData[8].keyPoints = ["A dictionary stores key-value pairs, written with { }", "Data is accessed by key, not by numeric index", "Common methods include keys(), values(), and items()", "A set is an unordered collection of unique values"];
lessonsData[9].keyPoints = ["try/except catches errors so the program does not crash", "You can handle specific errors such as ValueError and ZeroDivisionError", "finally always runs, whether or not there is an error", "An unhandled error stops the program"];
lessonsData[10].keyPoints = ["Combines variables, loops, functions, and conditionals into one full program", "The focus is on program logic, not new concepts", "Practice breaking a problem into small steps"];
lessonsData[11].keyPoints = ["import lets you use code from another module or library", "Python's built-in modules are called the standard library, such as math and random", "You can import specific parts with from module import name", "You can alias a module with import module as alias"];
lessonsData[12].keyPoints = ["The final project combines everything from Modules 1-11", "It tests the ability to design, write, and debug a program from scratch", "It is a chance to add your own creative features"];

let currentLessonId = 1;
let activeChallengeLesson = 1;
let completedLessonsCount = 0;

const lessonChallenges = {
    1: [
        ['Say Hello', 'Print the text "Hello, Python!".', 'Use print("Hello, Python!").', 'Hello, Python!'],
        ['Show a Number', 'Print the number 7.', 'Numbers do not need quotation marks.', '7'],
        ['Add Two Numbers', 'Calculate 4 + 6 and print the result.', 'Put the expression inside print().', '10'],
        ['Multiply', 'Calculate 9 * 3 and print the result.', 'Use * for multiplication.', '27'],
        ['Two-Line Greeting', 'Print "Welcome" on the first line and "Coder" on the second line.', 'Use two print() calls.', 'Welcome\nCoder']
    ],
    2: [
        ['Store a Name', 'Create name = "Alya" and print name.', 'Assign the text first, then use print(name).', 'Alya'],
        ['Add Variables', 'Set apples = 4 and oranges = 3, then print their total.', 'Use print(apples + oranges).', '7'],
        ['Update a Score', 'Set score = 10, add 5 to it, then print score.', 'You can write score = score + 5.', '15'],
        ['Calculate a Total', 'Set price = 12 and quantity = 4, then print the total price.', 'Multiply the two variables.', '48'],
        ['Mini Receipt', 'Set books = 3 and price = 8. Print the total cost, then print the number of books on the next line.', 'Use two print() calls and variables in both.', '24\n3']
    ],
    3: [
        ['First Loop', 'Use range(3) to print 0, 1, and 2.', 'Start with: for number in range(3):', '0\n1\n2'],
        ['Repeat a Message', 'Use a loop to print "Go" three times.', 'Use range(3) and print("Go") inside the loop.', 'Go\nGo\nGo'],
        ['Count from One', 'Use a loop to print the numbers 1, 2, and 3.', 'Use range(1, 4).', '1\n2\n3'],
        ['Even Numbers', 'Use a loop to print 2, 4, and 6.', 'Use range(2, 7, 2).', '2\n4\n6'],
        ['Square Counter', 'Use a loop from 1 through 3 and print each number multiplied by itself.', 'Inside the loop, print(number * number).', '1\n4\n9']
    ],
    4: [
        ['Call a Function', 'Define greet() to print "Hello" and call it.', 'Define with def greet():, indent print(), then call greet().', 'Hello'],
        ['Reusable Message', 'Define show_ready() to print "Ready" and call it.', 'The function body must be indented.', 'Ready'],
        ['Function with a Number', 'Define show_score() to print 100, then call it.', 'Put print(100) in the function.', '100'],
        ['Call Twice', 'Define cheer() to print "Go!" and call it two times.', 'Call cheer() on two separate lines.', 'Go!\nGo!'],
        ['Two Functions', 'Define start() to print "Start" and finish() to print "Finish". Call them in that order.', 'Define both functions before calling them.', 'Start\nFinish']
    ],
    5: [
        ['Class Attribute', 'Create a class named Student with name = "Mia", then print Student.name.', 'Class attributes are accessed with ClassName.attribute.', 'Mia'],
        ['Status Class', 'Create a class named Game with status = "Ready", then print Game.status.', 'Indent the status assignment inside the class.', 'Ready'],
        ['Two Attributes', 'Create a class named Book with title = "Python" and pages = 120. Print Book.title.', 'Add both attributes inside Book.', 'Python'],
        ['Read a Number', 'Create a class named Level with number = 3, then print Level.number.', 'Use print(Level.number).', '3'],
        ['Class Summary', 'Create a class named Course with name = "Python" and lessons = 12. Print name first, then lessons.', 'Use two print() calls with Course attributes.', 'Python\n12']
    ],
    6: [
        ['Simple Decision', 'Set score = 80. If score is at least 60, print "Pass".', 'Use if score >= 60:.', 'Pass'],
        ['Else Branch', 'Set age = 15. Print "Adult" if age is at least 18; otherwise print "Minor".', 'Use an if/else statement.', 'Minor'],
        ['Compare Values', 'Set temperature = 30. Print "Hot" when it is greater than 25.', 'Use if temperature > 25:.', 'Hot'],
        ['Three Outcomes', 'Set score = 75. Print "Excellent" for 90+, "Pass" for 60+, otherwise "Retry".', 'Use if, elif, and else.', 'Pass'],
        ['Ticket Check', 'Set tickets = 2 and needed = 3. Print "More needed" if tickets is less than needed, otherwise print "Ready".', 'Compare the two variables in an if statement.', 'More needed']
    ],
    7: [
        ['Read an Item', 'Create colors = ["red", "blue", "green"] and print the first item.', 'The first index is 0.', 'red'],
        ['Read the Last Item', 'Create numbers = [10, 20, 30] and print the last item.', 'The last item here is at index 2.', '30'],
        ['List Length', 'Create pets = ["cat", "dog", "fish"] and print its length.', 'Use len(pets).', '3'],
        ['Add an Item', 'Create tasks = ["study", "rest"], append "code", then print the list length.', 'Use tasks.append("code").', '3'],
        ['List Total', 'Create scores = [5, 10, 15] and print the sum of all three items.', 'Add the indexed values together.', '30']
    ],
    8: [
        ['Read a Key', 'Create user = {"name": "Nina"} and print the name.', 'Use user["name"].', 'Nina'],
        ['Read a Number', 'Create game = {"level": 4} and print the level.', 'Dictionary values use square brackets and a key.', '4'],
        ['Two Keys', 'Create book = {"title": "Python", "pages": 200} and print book["pages"].', 'Use the pages key.', '200'],
        ['Profile Output', 'Create profile with name = "Rafi" and city = "Jakarta". Print the name then city.', 'Use two print() calls.', 'Rafi\nJakarta'],
        ['Dictionary Calculation', 'Create cart = {"price": 15, "quantity": 3} and print price times quantity.', 'Access both values from cart before multiplying.', '45']
    ],
    9: [
        ['Safe Try', 'Write a try block that prints "Safe".', 'Start with try: and indent print("Safe").', 'Safe'],
        ['Handle an Error', 'Write a try block that prints "Working" and an except block that prints "Error".', 'The try block succeeds, so the output is Working.', 'Working'],
        ['Convert a Number', 'In a try block, convert "12" with int() and print it. Add an except ValueError block that prints "Invalid".', 'The conversion succeeds, so print the converted value.', '12'],
        ['Invalid Conversion', 'Try to convert "abc" with int(). If it fails, print "Invalid" in except ValueError.', 'The except block should handle the ValueError.', 'Invalid'],
        ['Protected Calculation', 'Try to print 20 / 4. Add an except block that prints "Cannot divide".', 'The calculation succeeds, so the output is 5.', '5']
    ],
    10: [
        ['Welcome Program', 'Create name = "Python" and print "Welcome Python".', 'Join text and the variable with +.', 'Welcome Python'],
        ['Score Checker', 'Set score = 70. Print "Passed" if it is at least 60, otherwise "Try again".', 'Combine a variable with an if/else.', 'Passed'],
        ['List Report', 'Create scores = [10, 20, 30] and print the second score.', 'The second item has index 1.', '20'],
        ['Reusable Greeting', 'Define greet() to print "Welcome" and call it.', 'Use a function definition and a call.', 'Welcome'],
        ['Study Tracker', 'Create subject = "Python" and sessions = 3. Print the subject, then print sessions * 2.', 'Use variables and two print() calls.', 'Python\n6']
    ],
    11: [
        ['Import Math', 'Import math and print math.sqrt(9).', 'Use import math before calling math.sqrt().', '3'],
        ['Square Root', 'Import math and print the square root of 25.', 'Use math.sqrt(25).', '5'],
        ['Round Up', 'Import math and print math.ceil(4.2).', 'Use math.ceil().', '5'],
        ['Circle Helper', 'Import math and print math.floor(8.9).', 'Use math.floor().', '8'],
        ['Two Math Results', 'Import math. Print math.sqrt(16), then print math.ceil(2.1).', 'Use two print() calls after one import.', '4\n3']
    ],
    12: [
        ['Final Greeting', 'Create name = "Coder" and print "Hello Coder".', 'Combine a string and variable.', 'Hello Coder'],
        ['Final Collection', 'Create skills = ["Python", "Logic", "Debugging"] and print its length.', 'Use len(skills).', '3'],
        ['Final Decision', 'Set completed = 5. Print "Complete" if completed is at least 5, otherwise "Keep going".', 'Use an if/else statement.', 'Complete'],
        ['Final Function', 'Define celebrate() to print "Well done!" and call it.', 'Define it first, then call it.', 'Well done!'],
        ['Final Report', 'Create score = 95. Print "Excellent" if score is at least 90, otherwise "Keep learning".', 'Use a conditional to produce the final report.', 'Excellent']
    ]
};

Object.entries(lessonsData).forEach(([id, lesson]) => {
    lesson.challenges = lessonChallenges[id].map(([title, task, hint, expectedResult]) => ({ title, task, hint, expectedResult }));
});
