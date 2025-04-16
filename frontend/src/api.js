import axios from 'axios';

const URL = 'http://localhost:3002';

// added content
const apiClient = axios.create({
  baseURL: URL
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('User');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export async function getPosts() {
  const response = await apiClient.get(`/posts`);

  if (response.status === 200) {
    return response.data;
  } else {
    return
  }
}

export async function getPost(id) {

  const response = await apiClient.get(`/posts/${id}`);
  const post = response.data

  return post
  

}

export async function createPost(post) {
  const response = await apiClient.post(`/posts`, post);
  
  return response;
}

export async function updatePost(id, post) {
  const response = await apiClient.put(`/posts/${id}`, post);
  
  return response;
}

export async function deletePost(id) {
  const response = await apiClient.delete(`/posts/${id}`);
  
  return response;
}


//user
export async function getUser(id) {
  const response = await apiClient.get(`/users/${id}`);
  
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error('Failed to fetch posts');
  }
}

export async function createUser(user) {
  const response = await axios.post(`${URL}/users`, user);
  
  return response;
}

export async function updateUser(id, user) {
  const response = await axios.put(`/users/${id}`, user);
  
  return response;
}

export async function verifyUser(user) {
  const response = await axios.post(`${URL}/users/login`, user);
  
  if (response.data.success) {
    sessionStorage.setItem('User', response.data.token);
    return response.data.token;
  } else {
    return
  }
    
}

//toilet use
export async function getTodayToiletSession() {

  const response = await apiClient.get(`/toilet/today`);
  return response.data;
  

}

export async function recordToiletUse() {

  const response = await apiClient.post(`/toilet/use`);
  return response.data;
}

export async function getToiletHIstory() {
  const response = await apiClient.get(`/toilet/history`);
  
  return response;
}
