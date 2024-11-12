/**
 * Quiz
 * Name
 * Id
 * Perguntas
 * Opcoes
 * Resposta
 * Imagem da capa
 * Image{
 *  url,
 *  questionId
 * }
 * 
 * 
 */
class Quiz {
    constructor(name, id, questions, options, answers, coverImage, images) {
        this.name = name;
        this.id = id;
        this.questions = questions;
        this.options = options;
        this.answers = answers;
        this.coverImage = coverImage;
        this.images = images;
    }
}