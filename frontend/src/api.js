import axios from 'axios';

const URL = import.meta.env.MODE === 'production' 
  ? 'https://toilet-war.vercel.app/api'
  : 'http://localhost:3003';

// added content
const apiClient = axios.create({
  baseURL: URL,
  timeout: 10000,
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
  const data = await getImage(post.imageId)

  post.image = data

  return post
  

}

export async function createPost(post) {

  await createImage(post.file)
  const imageId = post.file.name
   post.imageId = imageId

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


//images
export async function createImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post(`${URL}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }); 
  return response
}

export async function getImage(id) {
const response = await axios.get(`${URL}/images/${id}`);
return response;
}


//get session by date
export async function getToiletSessionByDate(date) {
  try {
    const formattedDate = date.toISOString().split('T')[0];
    const response = await apiClient.get(`/toilet/date/${formattedDate}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching toilet session by date:", error);
    if (error.response && error.response.status === 404) {
      return {
        userId: sessionStorage.getItem('userId') || "",
        date: date,
        toiletUses: 0,
        complaints: 0,
        conflict: false
      };
    }
    throw error;
  }
}



//toilet use
//Decrease
export async function decreaseToiletUse(date) {
  const formattedDate = date.toISOString().split('T')[0]; 
  const response = await apiClient.post(`/toilet/decrease`, { date: formattedDate });
  return response.data;
}

//Delete session
export async function deleteToiletSession(date) {
  const formattedDate = date.toISOString().split('T')[0]; 
  const response = await apiClient.delete(`/toilet/session`, { 
    data: { date: formattedDate } 
  });
  return response.data;
}

//update
export async function recordToiletUse(date = null) {
  if (!date) {
    const response = await apiClient.post(`/toilet/use`);
    return response.data;
  } else {
    const formattedDate = date.toISOString().split('T')[0];
    const response = await apiClient.post(`/toilet/date/${formattedDate}/use`);
    return response.data;
  }
}

export async function getTodayToiletSession() {
  const response = await apiClient.get(`/toilet/today`);
  return response.data;
}

export async function getToiletHIstory() {
  const response = await apiClient.get(`/toilet/history`);
  
  return response;
}
