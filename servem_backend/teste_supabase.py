from decouple import config  
from supabase import create_client  

# Carregando as variáveis de ambiente  
SUPABASE_URL = config('SUPABASE_URL')  
SUPABASE_SERVICE_ROLE_KEY = config('SUPABASE_SERVICE_ROLE_KEY')  

# Criando o cliente do Supabase  
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)  

# Verificando a conexão com o Supabase  
print("Conexão bem-sucedida com o Supabase.")  

# Testando se um usuário pode acessar apenas seus próprios dados  
response = supabase.table("users").select("*").execute()  

# Exibindo a resposta  
print(response)  
