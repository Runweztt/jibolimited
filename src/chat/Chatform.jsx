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
      <form action="" className="chat-form" onSubmit={handleFormSubmit} >
            <input ref={inputRef}
              type="text"
              placeholder="message........"
              className="message-input"
              required
            />
            <button className="material-symbols-rounded">  </button>
          </form>
  )
}

export default Chatform