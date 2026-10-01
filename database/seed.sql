INSERT INTO brain_gym_questions
(domain, question, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty)
VALUES

-- LOGIC

(
    'logic',
    'If all roses are flowers, which statement must be true?',
    'All flowers are roses',
    'All roses are flowers',
    'Some flowers are not roses',
    'No roses are flowers',
    'B',
    'If all roses are flowers, then it must be true that all roses are flowers.',
    'easy'
),

(
    'logic',
    'A is taller than B. B is taller than C. Who is definitely the tallest?',
    'A',
    'B',
    'C',
    'Cannot determine',
    'A',
    'If A is taller than B and B is taller than C, then A is definitely the tallest.',
    'easy'
),

(
    'logic',
    'If today is Monday, what day will it be 17 days from today?',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'C',
    'If today is Monday, then 17 days from today will be a Thursday.',
    'easy'
),

(
    'logic',
    'A clock shows exactly 3:00. What is the angle between the hour and minute hands?',
    '30 degrees',
    '60 degrees',
    '90 degrees',
    '120 degrees',
    'C',
    'A clock showing exactly 3:00 has the hour hand at 90 degrees and the minute hand at 0 degrees, creating a 90-degree angle.',
    'easy'
),

(
    'logic',
    'Some programmers are gamers. All gamers are creative. What must be true?',
    'All programmers are creative',
    'Some programmers are creative',
    'No programmers are creative',
    'All creative people are programmers',
    'B',
    'If some programmers are gamers and all gamers are creative, then some programmers are creative.',
    'medium'
),

-- PATTERNS

(
    'patterns',
    'What number comes next? 2, 4, 8, 16, ?',
    '20',
    '24',
    '32',
    '36',
    'C',
    'Each number is multiplied by 2 to get the next number.',
    'easy'
),

(
    'patterns',
    'What number comes next? 3, 6, 12, 24, ?',
    '36',
    '42',
    '48',
    '54',
    'C',
    'Each number is multiplied by 2 to get the next number.',
    'easy'
),

(
    'patterns',
    'What number comes next? 1, 4, 9, 16, ?',
    '20',
    '24',
    '25',
    '30',
    'C',
    'Each number is a perfect square (1², 2², 3², 4², 5²).',
    'easy'
),

(
    'patterns',
    'What number comes next? 5, 10, 20, 40, ?',
    '60',
    '70',
    '80',
    '90',
    'C',
    'Each number is multiplied by 2 to get the next number.',
    'easy'
),

(
    'patterns',
    'What number comes next? 2, 6, 12, 20, ?',
    '24',
    '28',
    '30',
    '32',
    'C',
    'If some programmers are gamers and all gamers are creative, then some programmers are creative.',
    'medium'
),

-- QUICK MATH

(
    'quick_math',
    'What is 15% of 200?',
    '20',
    '25',
    '30',
    '35',
    'C',
    '15% of 200 is 30.',
    'easy'
),

(
    'quick_math',
    'What is 24 × 5?',
    '100',
    '110',
    '120',
    '130',
    'C',
    '24 times 5 is 120.',
    'easy'
),

(
    'quick_math',
    'What is 144 ÷ 12?',
    '10',
    '11',
    '12',
    '14',
    'C',
    '144 divided by 12 is 12.',
    'easy'
),

(
    'quick_math',
    'If x + 7 = 15, what is x?',
    '6',
    '7',
    '8',
    '9',
    'C',
    'If x + 7 = 15, then x = 8.',
    'easy'
),

(
    'quick_math',
    'What is 25% of 80?',
    '15',
    '20',
    '25',
    '30',
    'B',
    '25% of 80 is 20.',
    'medium'
),

-- MEMORY

(
    'memory',
    'Remember this sequence: 7, 2, 9, 4. Which number was second?',
    '7',
    '2',
    '9',
    '4',
    'B',
    'The second number in the sequence is 2.',
    'easy'
),

(
    'memory',
    'Remember this sequence: 3, 8, 1, 6. Which number was third?',
    '3',
    '8',
    '1',
    '6',
    'C',
    'The third number in the sequence is 1.',
    'easy'
),

(
    'memory',
    'Remember these words: Apple, River, Chair, Moon. Which word was third?',
    'Apple',
    'River',
    'Chair',
    'Moon',
    'C',
    'The third word in the sequence is Chair.',
    'easy'
),

(
    'memory',
    'Remember this sequence: 5, 1, 8, 3, 6. Which number was last?',
    '3',
    '5',
    '6',
    '8',
    'C',
    'The last number in the sequence is 6.',
    'easy'
),

(
    'memory',
    'Remember these colors: Red, Blue, Green, Yellow. Which color was second?',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'B',
    'The second color in the sequence is Blue.',
    'easy'
),

-- ATTENTION

(
    'attention',
    'Which word is different from the others?',
    'APPLE',
    'APPLE',
    'APPEL',
    'APPLE',
    'C',
    'The word "APPEL" is misspelled compared to the others.',
    'easy'
),

(
    'attention',
    'Which number appears twice? 4, 7, 2, 9, 5, 7, 1',
    '4',
    '7',
    '2',
    '9',
    'B',
    'The number 7 appears twice in the sequence.',
    'easy'
),

(
    'attention',
    'Which pair is exactly the same?',
    'K8M2 - K8M2',
    'P4Q7 - P4Q1',
    'A6B3 - A6B8',
    'X9Z2 - X9Z7',
    'A',
    'The pair "K8M2 - K8M2" is exactly the same.',
    'easy'
),

(
    'attention',
    'Which word has a different number of letters?',
    'TABLE',
    'CHAIR',
    'BOOK',
    'PHONE',
    'C',
    'The word "BOOK" has 4 letters, while the others have 5.',
    'easy'
),

(
    'attention',
    'Find the odd one out: 12, 18, 24, 31, 36',
    '12',
    '18',
    '24',
    '31',
    'D',
    'The number 31 is odd, while the others are even.',
    'medium'
);