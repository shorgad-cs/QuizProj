import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";

export class ExamService {
    constructor() {
        this.storageKey = "exams";
    }

    getAllExams() {
        // Get data from localStorage by exams key
        const data = localStorage.getItem(this.storageKey);

        if (!data) {
            return [];
        }

        //continue if key exsists and parse data to array of objects
        const plainExams = JSON.parse(data);
        //for each examData(Exam) return new Exam object with the same data and for each
        //  questionData(Question) in examData.questions return new Question object with the same data
        // clone the data to new objects to avoid direct manipulation of localStorage data
        let allExamsClones = plainExams.map(examData => {
            const exam = new Exam(examData.title);

            exam.id = examData.id;
            exam.createdAt = examData.createdAt;

            //InNER Clone for Questions
            exam.questions = examData.questions.map(questionData => {
                const question = new Question(
                    questionData.text,
                    questionData.answers,
                    questionData.correctAnswerIndex
                );

                question.id = questionData.id;

                return question;
            });

            return exam;
        });
        return allExamsClones;
    }

    //Save To Local Storage
    saveExam(exam) {
        const exams = this.getAllExams();

        //deleteExam(exam.id) to remove old version of the exam if it already exists

        exams.push(exam);

        localStorage.setItem(this.storageKey, JSON.stringify(exams));
    }

    deleteExam(examId) {
        const exams = this.getAllExams();

        const filteredExams = exams.filter(exam => exam.id !== examId);

        localStorage.setItem(this.storageKey, JSON.stringify(filteredExams));
    }

    getExamById(examId) {
        const exams = this.getAllExams();

        return exams.find(exam => exam.id === examId);
    }

    clearAllExams() {
        localStorage.removeItem(this.storageKey);
    }
}