module.exports = {
  signIn: async (email, password) => {
    console.log(email, password);
    return { ok: true };
  }
};
