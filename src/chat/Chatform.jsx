import { useRef } from "react";


const Chatform = ({ChatHistory, setChatHistory, generateBot}) => {

    const inputRef = useRef()

    const handleFormSubmit =(e)=>{
        e.preventDefault();

        const userMessage = inputRef.current.value.trim()
        if(!userMessage) return;
        inputRef.current.value = ""

        // update chat history with the user message
        setChatHistory((history) => [...history, { role: "user", text: userMessage}]);
        
        //  thinking placeholding for the bot
      setTimeout(()=>{
         //  thinking placeholding for the bot
             setChatHistory((history) => [...history, { role: "model", text: "thinking..."}]);
                 // call the function to generate the bo respones
              generateBot([...ChatHistory,{ role: "user", text: `Using the details provided above,please answer this query ${userMessage}`}]);

      },600)
           
     
    };

   
        

    
  return (
      <form action="" className="flex items-center gap-2" onSubmit={handleFormSubmit} >
            <input ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
            <button 
              type="submit"
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg hover:shadow-xl"
              aria-label="Send message"
            >
              <span className="hidden sm:inline">Send</span>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            </button>
          </form>
  )
}

export default Chatform