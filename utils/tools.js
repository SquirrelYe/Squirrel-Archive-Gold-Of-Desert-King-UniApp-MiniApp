module.exports = {
  // toast
  toast:{
    success(msg) { return uni.showToast({ title: msg, icon: 'success', }); },
    loading(msg) { return uni.showToast({ title: msg, icon: 'loading', }); },
    none(msg) { return uni.showToast({ title: msg, icon: 'none', }); },
    hide(){ return uni.hideToast();}
  },

  // loading
  loading:{
    show(msg){ return uni.showLoading({ title: msg,  mask: true }); },
    hide(){ return uni.hideLoading();}
  },

}