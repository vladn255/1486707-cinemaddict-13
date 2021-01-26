import Observer from "../utils/observer.js";
import dayjs from "dayjs";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, comments) {
    this._comments = comments.slice();

    this._notify(updateType);
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comments = [
      ...this._comments,
      update
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, updateId) {

    const index = this._comments.findIndex((comment) => comment.id === updateId);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType);
  }

  switchDeletingStatus(updateType, updateId, boolean) {
    const index = this._comments.findIndex((comment) => comment.id === updateId);

    this._comments[index].isDeleting = boolean;

    this._notify(updateType);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          emoji: comment.emotion,
          text: comment.comment,
          isDeleting: false
        }
    );

    delete adaptedComment.emotion;
    delete adaptedComment.comment;

    return adaptedComment;
  }

  static adaptLocalToServer(localComment) {
    const adaptedComment = Object.assign(
        {},
        localComment,
        {
          "emotion": localComment.emoji,
          "comment": localComment.text,
          "date": dayjs().toDate()
        }
    );
    delete adaptedComment.emoji;
    delete adaptedComment.text;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          "emotion": comment.emoji,
          "comment": comment.text
        }
    );

    delete adaptedComment.emoji;
    delete adaptedComment.text;
    delete adaptedComment.isDeleting;

    return adaptedComment;
  }
}
