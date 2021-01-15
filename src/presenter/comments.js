import {RenderPosition, render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../utils/const.js";

import CommentsView from "../view/comments.js";

export default class Comments {
  constructor(container, changeData, commentsModel) {
    this._commentsContainer = container;
    this._changeData = changeData;
    this._commentsModel = commentsModel;

    this._commentsComponent = null;

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    this._comments = this._getComments();

    const prevCommentsComponent = this._commentsComponent;

    this._commentsComponent = new CommentsView(this._comments);

    if (prevCommentsComponent === null) {

      render(this._commentsContainer, this._commentsComponent, RenderPosition.BEFORE_END);
      this._commentsComponent.setDeleteClickHandler(this._handleDeleteClick);
      return;
    }

    replace(this._commentsComponent, prevCommentsComponent);
    remove(prevCommentsComponent);
  }

  // получение списка комментариев
  _getComments() {
    return this._commentsModel.getComments();
  }

  // обработчик удаления комментария
  _handleDeleteClick() {
    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        console.log(`Delete worked`)
    );
  }

}
