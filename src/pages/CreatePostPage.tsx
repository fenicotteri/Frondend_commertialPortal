import PostForm from '../components/PostForm';

const CreatePostPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Публикация
        </h1>
        <PostForm/>
      </div>
    </div>
  );
};

export default CreatePostPage;
