import axiosClient from "@/axiosClient";

// start study session
export const startSession = async (payload) => {
  try {
    const response = await axiosClient.post("/study/start", payload);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// by fc
export const submitFlashcardAnswer = async (payload) => {
  try {
    const response = await axiosClient.post("/study/flashcard/submit", payload);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// by typing
export const submitTypingAnswer = async (payload) => {
  try {
    const response = await axiosClient.post("/study/typing/submit", payload);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// by game-matching
export const submitMatchingAnswer = async (payload) => {
  try {
    const res = await axiosClient.post("/study/matching/submit", payload);
    return res.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// by quiz
export const submitQuizAnswer = async (payload) => {
  try {
    const res = await axiosClient.post("/study/submit-quiz-answer", payload);
    return res.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// end study session
export const endSession = async (sessionId) => {
  try {
    const response = await axiosClient.post("/study/end", {
      session_id: sessionId,
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// get due cards: optional collection, limit
export const getDueCards = async (params = {}) => {
  try {
    const response = await axiosClient.get("/study/due-cards", { params });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get study statistics
export const getStudyStats = async () => {
  try {
    const response = await axiosClient.get("/study/stats");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
