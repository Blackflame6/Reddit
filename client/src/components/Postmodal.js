import React from "react";
import AuthModalContext from "../context/AuthModalContext";
import RerenderContext from "../context/RerenderContext";
import PostCommentForm from "./PostCommentForm";
import ModalContent from "./ModalContent";
import axios from "axios";
import OutsideClickHandler from "react-outside-click-handler";
import Comments from "./Comments";
import { useContext, useState, useEffect } from "react";

const Postmodal = (props) => {
  const { postModalVisibility, setPostModalVisibility } =
    useContext(AuthModalContext);
  const [modalComment, setModalComment] = useState({});
  const [postComments, setPostComments] = useState([]);
  const { newComments } = useContext(RerenderContext);

  // const refreshVotes = async() => {
  //   const modalCommentsIds = [modalComment._id, ...modalComment.map(modalComment => modalComment._id)]
  //   const response = await axios.post("http://localhost:4000/votes/totals", modalCommentsIds)
  //   console.log)
  // }

  useEffect(() => {
    const getModalComment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/comments/${props.id}`,
          {
            withCredentials: true,
          }
        );

        setModalComment(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getModalComment();
    const getPostComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/comments/root/${props.id}`,
          { withCredentials: true }
        );

        setPostComments(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getPostComments();
  }, [newComments, props.id]);

  function reset() {
    setPostModalVisibility(false);
  }
 
  return (
    <div
      className={
        postModalVisibility ? "post-modal-page" : "hide-post-modal-page"
      }
    >
      <OutsideClickHandler onOutsideClick={reset}>
        <div className="post-sub">
          <ModalContent {...modalComment} />
          {!!modalComment && !!modalComment._id && (
            <>
              <hr />

              <PostCommentForm
                setPostComments={setPostComments}
                chosenCommunity={modalComment.chosenCommunity}
                title={modalComment.title}
                rootId={modalComment._id}
                parentId={modalComment._id}
                showAuthor={true}
                showButton={false}
              />

              <hr />

              <Comments
                rootId={modalComment._id}
                parentId={modalComment._id}
                postComments={postComments}
              />
            </>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default Postmodal;
