import React, { useState, useEffect } from 'react';
import bin_del from './content/img/bin.png';
import edit from './content/img/edit.png';
import Componentes_Header from '../../componentes/Componentes_Header';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', author: '', timestamp: '', text: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    // Load posts from local storage on component mount
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  useEffect(() => {
    // Update local storage when posts change
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const handleInputChange = (event) => {
    // Handle input changes in the form fields
    const { name, value } = event.target;
    setNewPost({ ...newPost, [name]: value });
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    // Adjust textarea height based on content
    const textarea = document.querySelector('.comentario1');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
      setTextareaHeight(textarea.style.height);
    }
  };

  const correctTextFormat = (text) => {
    // Correct text format by removing excess line breaks
    let correctedText = text.trim();
    correctedText = correctedText.replace(/\n{3,}/g, '\n\n');
    return correctedText;
  };

  const addPost = (event) => {
    event.preventDefault();

    // Create a new post object
    let correctedText = newPost.text.trim();
    correctedText = correctedText.replace(/\n{3,}/g, '\n\n');

    const post = {
      ...newPost,
      text: correctedText,
      timestamp: Date.now(),
    };

    // Add the new post to the posts array
    setPosts([...posts, post]);

    // Reset form fields and textarea height
    setEditingPost(null);
    setNewPost({ title: '', author: '', timestamp: '', text: '' });
    resetTextareaHeight();

    // Display success message in modal
    setModalMessage('Post created!');
    setIsModalOpen(true);
    closeAfterTimeout(1500); 
  };

  const updatePost = (event) => {
    event.preventDefault();

    // Update an existing post
    const post = {
      ...newPost,
      text: correctTextFormat(newPost.text),
      timestamp: Date.now(),
    };

    const updatedPosts = [...posts];
    updatedPosts[editingPost] = post;
    setPosts(updatedPosts);

    // Reset form fields and textarea height
    setEditingPost(null);
    setNewPost({ title: '', author: '', timestamp: '', text: '' });
    resetTextareaHeight();

    // Display success message in modal
    setModalMessage('Post updated!');
    setIsModalOpen(true);
    closeAfterTimeout(1500);
  };

  const editPost = (index) => {
    if (
      posts[index].title.trim() === '' ||
      posts[index].author.trim() === '' ||
      posts[index].text.trim() === ''
    ) {
      return;
    }

    let correctedText = newPost.text.trim();
    correctedText = correctedText.replace(/\n{3,}/g, '\n\n');

    const post = {
      ...newPost,
      text: correctedText,
      timestamp: Date.now(),
    };

    // Set the index of the post being edited and pre-fill the form fields
    setEditingPost(index);
    setNewPost(posts[index]);
  };

  const deletePost = (index) => {
    // Delete a post from the posts array
    const updatedPosts = [...posts];
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);

    // Display success message in modal
    setModalMessage('Post deleted!');
    setIsModalOpen(true);
    closeAfterTimeout(1500);
  };

  const formatTimestamp = (timestamp) => {
    // Format the timestamp to display relative time
    const currentDate = new Date();
    const postDate = new Date(timestamp);

    const secondsAgo = Math.floor((currentDate - postDate) / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);

    if (secondsAgo < 60) {
      return 'now';
    } else if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`;
    } else {
      return `${hoursAgo} hours ago`;
    }
  };

  const resetTextareaHeight = () => {
    // Reset textarea height to auto
    const textarea = document.querySelector('.comentario1');
    if (textarea) {
      textarea.style.height = 'auto';
    }
  };

  const openModal = (message) => {
    // Open the modal with a specified message
    setModalMessage(message);
    setIsModalOpen(true);
    closeAfterTimeout(1500);
  };

  const closeModal = () => {
    // Close the modal
    setIsModalOpen(false);
    setModalMessage('');
  };

  const closeAfterTimeout = (timeout) => {
    // Close the modal after a specified timeout
    setTimeout(() => {
      closeModal();
    }, timeout);
  };

  return (
    <div>
      <Componentes_Header />
      <form onSubmit={editingPost !== null ? updatePost : addPost}>
        <h2>React Agenda</h2>
        <div className="container">
          <label className="title">
            <p>Title</p>
            <input
              className="input-title"
              type="text"
              placeholder="Hello world"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              required
              maxLength={30}
            />
          </label>
          <label className="autor">
            <p>Content</p>
            <input
              className="comentario"
              placeholder="Content here"
              name="author"
              value={newPost.author}
              onChange={handleInputChange}
              maxLength={20}
              required
            />
          </label>

          <label>
            <textarea
              className="comentario1"
              name="text"
              value={newPost.text}
              onChange={handleInputChange}
              onInput={(event) => {
                event.target.style.height = 'auto';
                event.target.style.height = event.target.scrollHeight + 'px';
              }}
              maxLength={800}
              style={{ height: textareaHeight }}
              id="asd"
              required
            />
          </label>

          <div className="btn_publish">
            <button type="submit" title="Create">
              {editingPost !== null ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </form>

      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <div className="container_titulo">
              <h3>{post.title}</h3>
              <div className="btn">
                <button className="btn_bin_edit1" onClick={() => deletePost(index)}>
                  <img title="Delete" src={bin_del} alt="Bin" className="bin_del" />
                </button>
                <button href="#top" className="btn_bin_edit2" onClick={() => editPost(index)}>
                  <img title="Edit" src={edit} alt="Edit" className="edit" />
                </button>
              </div>
            </div>
            <aside>
              <div>
                <p>@{post.author}</p>
                <p>{formatTimestamp(post.timestamp)}</p>
              </div>
              <p>
                {post.text.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </aside>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* <span className="close" onClick={closeModal}>
              &times;
            </span> */}
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
