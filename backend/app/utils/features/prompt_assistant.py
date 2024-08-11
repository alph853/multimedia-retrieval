# from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
# from timeit import default_timer as timer

# from huggingface_hub import login
# login(token="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")

# # You can use a more powerful model like t5-large or gpt-3
# model_name = "mistralai/Mistral-7B-Instruct-v0.2"
# tokenizer = AutoTokenizer.from_pretrained(model_name, padding_side="left")
# model = AutoModelForCausalLM.from_pretrained(
#     model_name, device_map="cuda", quantization_config=BitsAndBytesConfig(load_in_8bit=True))

# model.generation_config.pad_token_id = tokenizer.pad_token_id


# def generate_prompt(q, model, tokenizer):
#     input_text = f"Use prompt engineering to refine this query. You should give at least 3 selections and be not hallucinate: {
#         q}"
#     model_inputs = tokenizer(input_text, return_tensors="pt").to("cuda")

#     generated_ids = model.generate(
#         **model_inputs, max_new_tokens=1000, do_sample=True)
#     result = tokenizer.decode(generated_ids[0].tolist())

#     return result


# while True:
#     # Step 1: Get user query
#     user_query = input("Enter your query: ")
#     if user_query == "exit":
#         break

#     s = timer()
#     # Step 2: Generate a refined prompt
#     refined_prompt = generate_prompt(user_query, model, tokenizer)
#     print(f"Recommended Prompt: {refined_prompt}")
#     e = timer()

#     print(f"Time taken: {e-s:0.6f} seconds")
