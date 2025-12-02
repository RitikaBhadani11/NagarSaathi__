import { useState } from 'react';
import Navbar from "../../components/Navbar";
import { FaUser, FaPaperPlane, FaThumbsUp, FaComment, FaTrash, FaGlobe, FaCalendarAlt } from 'react-icons/fa';

const DiscussionForum = () => {
  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' }
  ];

  // Sample initial data with current user
  const currentUser = { id: 'user1', name: 'You' };
  
  const initialPosts = [
    {
      id: 1,
      text: "The park near my house needs cleaning. Can we organize something this weekend?",
      author: { id: 'user2', name: 'Rahul' },
      language: 'en',
      timestamp: "2023-06-15 10:30",
      upvotes: 3,
      comments: [
        {
          id: 101,
          text: "I can help on Sunday morning",
          author: { id: 'user3', name: 'Priya' },
          timestamp: "2023-06-15 11:45",
          language: 'en'
        }
      ]
    },
    {
      id: 2,
      text: "माझ्या वॉर्डमध्ये कचरा ट्रक नियमित येत नाही",
      author: currentUser,
      language: 'mr',
      timestamp: "2023-06-14 15:45",
      upvotes: 5,
      comments: []
    }
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState({ text: '', language: 'en' });
  const [newComments, setNewComments] = useState({});

  // Add new post
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.text.trim()) return;

    const post = {
      id: Date.now(),
      text: newPost.text,
      author: currentUser,
      language: newPost.language,
      timestamp: new Date().toLocaleString(),
      upvotes: 0,
      comments: []
    };

    setPosts([post, ...posts]);
    setNewPost({ text: '', language: 'en' });
  };

  // Add comment to a post
  const handleAddComment = (postId) => {
    if (!newComments[postId]?.text?.trim()) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              text: newComments[postId].text,
              author: currentUser,
              timestamp: new Date().toLocaleString(),
              language: newComments[postId].language
            }
          ]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setNewComments({ ...newComments, [postId]: { text: '', language: 'en' } });
  };

  // Upvote a post
  const handleUpvote = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
    ));
  };

  // Delete a post (only for author)
  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  // Delete a comment (only for author)
  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment.id !== commentId)
          };
        }
        return post;
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Community Discussion Forum</h1>
          <p className="text-gray-600">Connect with your neighbors, share ideas, and discuss community matters</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* New Post Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Create New Post</h2>
                  <p className="text-sm text-gray-600">Share your thoughts with the community</p>
                </div>
              </div>

              <form onSubmit={handleAddPost}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Select Language</label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setNewPost({...newPost, language: lang.code})}
                        className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                          newPost.language === lang.code
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-700'
                            : 'bg-white border-gray-300 text-gray-600 hover:border-purple-300'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newPost.text}
                  onChange={(e) => setNewPost({...newPost, text: e.target.value})}
                  placeholder="What would you like to discuss? Share your thoughts, ideas, or concerns..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-gray-400 resize-none mb-4"
                  rows={5}
                  required
                />

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 flex items-center gap-2"
                  >
                    <FaPaperPlane /> Post Message
                  </button>
                </div>
              </form>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Discussions</h3>
              
              {posts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaComment className="text-purple-500 text-2xl" />
                  </div>
                  <p className="text-gray-600">No discussions yet. Be the first to post!</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Post Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">
                              {post.author.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-gray-800">{post.author.name}</span>
                              <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full">
                                {languages.find(l => l.code === post.language)?.flag} 
                                {languages.find(l => l.code === post.language)?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <FaCalendarAlt />
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleUpvote(post.id)}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 px-3 py-2 rounded-lg transition-all group"
                          >
                            <FaThumbsUp className={`text-gray-600 group-hover:text-purple-600 ${post.upvotes > 0 ? 'text-purple-600' : ''}`} /> 
                            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                              {post.upvotes}
                            </span>
                          </button>
                          {post.author.id === currentUser.id && (
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete post"
                            >
                              <FaTrash size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <div className="p-6">
                      <p className="text-gray-800 mb-6 whitespace-pre-line leading-relaxed">{post.text}</p>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-gray-100">
                      {post.comments.length > 0 && (
                        <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <FaComment className="text-purple-600" /> 
                            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                          </h3>
                          <div className="space-y-4">
                            {post.comments.map(comment => (
                              <div key={comment.id} className="flex gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                  <span className="text-white font-bold text-sm">
                                    {comment.author.name.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1 relative">
                                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <span className="font-medium text-sm text-gray-800">{comment.author.name}</span>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                          <FaCalendarAlt size={10} />
                                          <span>{comment.timestamp}</span>
                                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                                            {languages.find(l => l.code === comment.language)?.flag}
                                          </span>
                                        </div>
                                      </div>
                                      {comment.author.id === currentUser.id && (
                                        <button 
                                          onClick={() => handleDeleteComment(post.id, comment.id)}
                                          className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded"
                                        >
                                          <FaTrash size={14} />
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-gray-700 text-sm">{comment.text}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add Comment */}
                      <div className="p-6 border-t border-gray-100">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {currentUser.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="mb-3">
                              <label className="block text-gray-700 font-medium mb-2 text-sm">Comment Language</label>
                              <select 
                                value={newComments[post.id]?.language || 'en'}
                                onChange={(e) => setNewComments({
                                  ...newComments, 
                                  [post.id]: {
                                    ...newComments[post.id],
                                    language: e.target.value
                                  }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-gray-400 appearance-none"
                              >
                                {languages.map(lang => (
                                  <option key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <textarea
                              value={newComments[post.id]?.text || ''}
                              onChange={(e) => setNewComments({
                                ...newComments, 
                                [post.id]: {
                                  ...newComments[post.id],
                                  text: e.target.value
                                }
                              })}
                              placeholder="Write your comment here..."
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-gray-400 resize-none text-sm"
                              rows={3}
                            />
                            <div className="flex justify-end mt-3">
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!newComments[post.id]?.text?.trim()}
                                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                <FaPaperPlane size={12} /> Post Comment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Guidelines */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Community Guidelines</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-purple-600 text-xs">✓</span>
                  </div>
                  <span>Be respectful and courteous to all members</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-purple-600 text-xs">✓</span>
                  </div>
                  <span>Stay on topic with community matters</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-purple-600 text-xs">✓</span>
                  </div>
                  <span>Use appropriate language and tone</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-purple-600 text-xs">✓</span>
                  </div>
                  <span>Report any inappropriate content</span>
                </li>
              </ul>
            </div>

            {/* Language Info */}
            <div className="bg-gradient-to-r from-white to-purple-50 rounded-2xl shadow-lg p-6 border border-purple-100">
              <h3 className="font-bold text-gray-800 mb-4">Available Languages</h3>
              <div className="space-y-3">
                {languages.map(lang => (
                  <div key={lang.code} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium text-gray-700">{lang.name}</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {posts.filter(p => p.language === lang.code).length} posts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Posts</span>
                  <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                    {posts.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Comments</span>
                  <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                    {posts.reduce((acc, post) => acc + post.comments.length, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Upvotes</span>
                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                    {posts.reduce((acc, post) => acc + post.upvotes, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;