# Quiz Module - User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Accessing the Quiz Module](#accessing-the-quiz-module)
3. [Creating a New Quiz](#creating-a-new-quiz)
4. [Managing Questions](#managing-questions)
   - [Creating Different Question Types](#creating-different-question-types)
   - [Editing Questions](#editing-questions)
   - [Reordering Questions](#reordering-questions)
5. [Enabling and Disabling a Quiz](#enabling-and-disabling-a-quiz)
6. [Accessing a Quiz as a User](#accessing-a-quiz-as-a-user)
7. [Viewing Quiz Results](#viewing-quiz-results)
8. [Troubleshooting](#troubleshooting)

## Introduction

The Quiz module for Odoo 17 is a comprehensive tool for creating and managing quizzes with various question types. This guide will help you create, configure, and manage quizzes and questions.

## Accessing the Quiz Module

To access the Quiz module:

1. Log in to your Odoo instance with an account that has Quiz Master privileges
2. Click on the **Quiz** menu in the main navigation bar
3. You will see the following options:
   - **Quizzes**: Manage all quizzes
   - **All Questions**: View and manage all questions across quizzes
   - **Quiz Sessions**: Monitor user attempts and results
   - **Quiz Masters**: Manage users with quiz administration privileges (admin only)

## Creating a New Quiz

To create a new quiz:

1. Navigate to **Quiz → Quizzes**
2. Click the **Create** button in the top-left corner
3. Fill in the following information:
   - **Quiz Title**: The name of your quiz
   - **Slug**: A URL-friendly identifier (automatically generated but can be customized)
   - **Time Limit**: Optional time constraint in minutes (leave empty for unlimited time)
   - **Maximum Attempts**: Limit how many times a user can take the quiz (0 = unlimited)
   - **Passing Score**: Minimum percentage required to pass the quiz
   - **Randomize Questions**: Toggle to shuffle question order for each user
   - **Show Results**: Toggle to show/hide results to users upon completion
4. Add a **Description** for your quiz in the Description tab
5. Click **Save** to create the quiz

![Creating a New Quiz](path_to_image)

## Managing Questions

After creating a quiz, you need to add questions to it.

### Adding Questions to a Quiz

1. From the quiz form view, click the **Manage Questions** button at the top
2. In the Questions view, click **Create** to add a new question
3. Choose the **Question Type** from the dropdown:
   - **Multiple Choice (Single Answer)**: One correct option
   - **Multiple Choice (Multiple Answers)**: Multiple correct options
   - **Fill in the Blanks**: Text with missing words users must input
   - **Match the Following**: Connect items from two columns
   - **Drag and Drop into Text**: Position items within text
   - **Drag and Drop into Zones**: Move items to designated areas
   - **Dropdown in Text**: Select options from dropdown menus in text
4. Enter the **Question HTML** (the question text)
5. Set the **Points** value for this question
6. Complete the fields specific to the question type you chose
7. Click **Save** to add the question to the quiz

### Creating Different Question Types

#### Multiple Choice (Single Answer)
1. Select **MCQ Single** as Question Type
2. Enter the question in **Question HTML**
3. In the **Choices** tab, add options by clicking **Add a line**
4. For each option, enter the **Choice Text** and toggle **Is Correct** for the correct answer
5. Only one option should be marked correct

#### Multiple Choice (Multiple Answers)
1. Select **MCQ Multiple** as Question Type
2. Enter the question in **Question HTML**
3. In the **Choices** tab, add options by clicking **Add a line**
4. For each option, enter the **Choice Text** and toggle **Is Correct** for all correct answers
5. Multiple options can be marked correct

#### Fill in the Blanks
1. Select **Fill Blank** as Question Type
2. In **Question HTML**, write your question text using `{{1}}`, `{{2}}` etc. as placeholders for blanks
3. In the **Answers** tab, add answers for each placeholder
4. The answer number should correspond to the placeholder number

Example:
- Question HTML: "The capital of France is {{1}} and the capital of Italy is {{2}}."
- Answers: 1 = "Paris", 2 = "Rome"

#### Match the Following
1. Select **Matching** as Question Type
2. Enter instructions in **Question HTML**
3. In the **Match Pairs** tab, add pairs by clicking **Add a line**
4. For each pair, add a **Left Item** and a **Right Item**
5. Each left item should match with exactly one right item

#### Drag and Drop into Text
1. Select **Drag Into Text** as Question Type
2. In **Question HTML**, write your text using `{{token1}}`, `{{token2}}` etc. as placeholders
3. In the **Drag Tokens** tab, add tokens by clicking **Add a line**
4. Each token should have a **Token Text** that will replace the corresponding placeholder

#### Dropdown in Text
1. Select **Dropdown Blank** as Question Type
2. In **Text Template**, write your text using `{{1}}`, `{{2}}` etc. as placeholders
3. In the **Blanks** tab, add dropdowns by clicking **Add a line**
4. For each blank, add **Options** with the correct one marked

### Editing Questions
1. Navigate to **Quiz → All Questions** or open the quiz and go to the Questions tab
2. Click on the question you want to edit
3. Make your changes
4. Click **Save** to apply changes

### Reordering Questions
1. Open the quiz and go to the Questions tab
2. Use the drag handle (⁞) on the left of each question to drag it into the desired order
3. The sequence is automatically saved

## Enabling and Disabling a Quiz

You can control whether a quiz is available to users by changing its published status:

### To Enable a Quiz
1. Open the quiz from **Quiz → Quizzes**
2. Toggle the **Published** button in the top-right corner to ON (green)
3. The quiz is now accessible to users via its public URL

### To Disable a Quiz
1. Open the quiz from **Quiz → Quizzes**
2. Toggle the **Published** button to OFF (gray)
3. The quiz is now hidden from users

### Quickly Viewing the Quiz Status
In the quiz list view, you can see the Published status as a toggle switch for each quiz.

## Accessing a Quiz as a User

Users can access quizzes through the following methods:

### Direct URL Access
1. The quiz URL follows the pattern: `https://your-domain.com/quiz/[slug]`
2. The quiz slug can be found in the quiz details
3. You can click "View Public URL" on the quiz form to open it directly

### Quiz List
1. Users can see all published quizzes at `https://your-domain.com/quiz`
2. From there, they can click on any quiz to start it

### Taking a Quiz
1. Enter your name and email (if required)
2. Click "Start Quiz"
3. Answer each question and use the "Next" button to proceed
4. After the last question, click "Submit" to complete the quiz

## Viewing Quiz Results

### As a Quiz Administrator
1. Navigate to **Quiz → Quiz Sessions**
2. You'll see a list of all quiz attempts with participant details
3. Click on any session to view detailed answers and scores

### By Quiz
1. Open the quiz from **Quiz → Quizzes**
2. Click on the "Sessions" tab to see all attempts for that specific quiz

### Session Details
For each session, you can see:
- Participant name and email
- Total score and percentage
- Pass/Fail status
- Start and end time
- Individual question responses

## Troubleshooting

### Quiz Not Visible to Users
- Check if the quiz is published
- Verify that the URL slug is correct
- Ensure users have proper access rights

### Questions Not Appearing
- Verify that questions have been added to the quiz
- Check that the question configuration is complete
- Ensure the questions are active

### Scoring Issues
- Verify that the correct answers are properly marked
- Check the points assigned to each question
- Review the quiz passing score setting

---

For additional support or questions about the Quiz module, please contact your system administrator or refer to the technical documentation.
