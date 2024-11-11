Feature para code review.
começando pelo front eu Dividi a feature em três partes: Frontend (React), Backend (Node.js com Express e multer) e o Banco de Dados (MySQL usando XAMPP pra desenvolvimento local).
Frontend (ReactJS)
O que fiz aqui: criei um componente chamado ProfilePictureUploader pra ser o centro de controle da foto de perfil.

Como deveria funcionar:
Upload da Imagem: O usuário escolhe uma imagem, e a função handleImageUpload valida o tipo e o tamanho do arquivo.
Se a imagem passar na validação, ela é enviada pro backend usando POST (com FormData pra conseguir mandar o arquivo).
Preview e Atualização: Depois que a imagem é salva no backend, o URL dela é enviado de volta e atualizado no frontend, aparecendo a nova foto.
Exclusão da Imagem: Tem um botão de excluir que chama handleDeleteImage, que envia um DELETE pro backend. Se der tudo certo, a imagem padrão aparece de volta.
como funcionou: 
Estava dando erro de importação no file usermodal para integração do front então tive que fazer diretamente dentro do arquivo de forma que O UserModal é o modal principal,
onde ocorre o controle de abertura, fechamento, envio do formulário e validação dos dados.
O ImageUpload faz parte desse modal e realiza o gerenciamento específico da imagem de perfil do usuário.
Ao selecionar um arquivo, ele é validado para garantir que seu tamanho não exceda 2MB.
Se a imagem estiver dentro do limite, é gerado um preview que o usuário pode visualizar antes de salvar.
Utilizamos um FileReader para gerar um preview em tempo real da imagem selecionada. Assim, o usuário pode ver como a imagem ficará antes de enviar.
Renderização Condicional:
Caso ocorra algum erro, como tamanho excedido, uma mensagem de erro é exibida em vermelho para orientar o usuário.
Quando o preview está disponível, ele é exibido em um formato circular.

Sobre o backend, eu não consegui fazer a conexão com front e banco de dados por não receber nenhum tipo de retorno ou reconhecer endpoint das rotas que eu estava usando. usei o insomnia pra
tentar percorrer a rota que eu estava ussando (3000) ou a do banco de dados (8080) mas de modo nenhum tive retorno. dito isso, vou explicar o que tentei fazer meio que cego e a logica por trás.

Começando pela configuração do Middleware de Upload (multer)
O arquivo upload.ts define o middleware multer para upload de imagens de perfil, especificando
Local de Armazenamento: As imagens são salvas na pasta uploads.
Limite de Tamanho: O limite de tamanho para upload é de 2 MB.
Validação de Formato: São aceitos apenas arquivos nos formatos jpeg, jpg e png.
Modelos e Configurações do Banco de Dados
No arquivo User.ts, o modelo User define a estrutura do usuário, incluindo o campo profileImage para armazenar o caminho da imagem. Esse modelo inclui validações de dados, 
associações com outros modelos e um método para verificar a senha do usuário.
O arquivo UserController.ts define três funções principais:
updateProfileImage: Faz upload de uma nova imagem, exclui a imagem antiga (se houver) e notifica clientes conectados via Socket.IO.
deleteProfileImage: Exclui a imagem atual do usuário, se existir, e também notifica clientes via Socket.IO.
updateProfile: Atualiza os dados do perfil, incluindo a imagem de perfil e outras informações, após validação com Yup.
No arquivo userRoutes.ts, as rotas para upload, atualização e exclusão de imagem de perfil estão definidas, protegidas por um middleware de autenticação isAuth.
