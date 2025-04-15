import { useState, useRef } from 'react';
import { createPost } from '../api';

export function CreateBlog() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState();

  const inputFile = useRef(null);

  const MAX_FILE_SIZE = 15000000

  async function handleSubmit() {
    let submitObject = {
      title: title,
      description: description,
      content: content,
      author: null,
      dateCreated: new Date(),
      file: file
    } 
   await createPost(submitObject)
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.'))
    if (fileExtension !== '.jpg' && fileExtension !== '.png' && fileExtension !== '.jpeg') {
      alert("Please upload a valid image file");
      inputFile.current.value = '';
      inputFile.current.type = 'File';
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 15MB");
      inputFile.current.value = '';
      inputFile.current.type = 'File';
      return
    }
    setFile(file)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a New Blog</h1>
      <label>
          Blog Post  Title:
          <input onChange={(e) => setTitle(e.target.value)} type="text" maxLength={100} required name="title" />
        </label>
        <br />
        <label>
          Blog Description:
          <input onChange={(e) => setDescription(e.target.value)} maxLength={200} required name="description"></input>
        </label>
        <br />
        <label>
          Blog Content:
          <textarea onChange={(e) => setContent(e.target.value)} maxLength={5000} required name="content"></textarea>
        </label>
        <br />
        <label htmlFor="">Insert Header Image: </label>
        <input type="file" onChange={handleFileUpload} ref={inputFile} required/>
        <button type="submit">Create Blog</button>
    </form>
  )
}