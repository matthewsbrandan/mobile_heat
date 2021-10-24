# NLW 7 HEAT MOBILE

## Iniciando o Projeto
  - Executaremos um comando para o expo criar nossa aplicação e em seguida ele pedirá para selecionar o template que usaremos, que será o blank (TypeScript).
  ``` expo init <application_name> ```
  - Após o fim da instalação já podemos executar o comando abaixo para rodar a aplicação:
  ``` expo start ```
  - Esse comando abrirá um aba web com as informações de como rodar o emulador, ou abrir no seu dispositivo físico.
  
## Alterando a Splash
  - As configurações da Splash ficam em app.json, lá você consegue configurar qual a imagem será a splash, a cor de fundo e muitas outras configurações da aplicação.

## Componentes
  - Funciona exatamente como no ReactJS, porém é obrigatório importar o React em todos os componentes que estiver utilizando.
  - Outra diferença da web, que possui várias tags, é que aqui temos basicamente View(Correspondente a Div) e Text(Correspondente ao p), e uma característica muito importante de se lembrar, é que não podemos ter textos soltos em um View, é obrigatório sempre ter um Text por volta.
  - Aqui também não temos a opção de escrever CSS, mas a sintaxe o StyleSheet que cria o css através de um objeto JS (com sintaxe CamleCase) trás maior parte dos atributos do CSS.

## Fonts externas
  - Para instalar fonts externas executamos o seguinte comando do expo:
  ``` expo install expo-font @expo-google-fonts/roboto ```
  - Depois precisamos importá-las no começo da aplicação dizendo quais fonts iremos utilizar.
  - Depois de importarmos as fonts precisamos carregá-las.
  ```
    ...
    import {
      useFonts,
      Roboto_400Regular,
      Roboto_700Bold
    } from '@expo-google-fonts/roboto';
    ...
    const [fontsLoaded] = useFonts({
      Roboto_400Regular,
      Roboto_700Bold
    });
  ```
  - Esse carregamento pode demorar um pouco, então para não carregar a aplicação sem as fonts utilizaremos uma outra dependência, que mantera o aplicativo em splash enquanto as fonts não estiverem carregadas.
  ``` expo install expo-app-loading ```
  ``` if(!fontsLoaded) return <AppLoading/>; ```

## Importando Imagens
  - Duas coisas que precisamos saber é que o typescript não entende a importação de svg, então temos que fazer essa tipagem manualmente e instalar algumas dependências para lidar com isso, e caso queiramos utilizar o svg como componente, é obrigatório que o nome dele seja passado com letra Maiúscula.
  - Para que o expo e o react-native consigam lidar com o svg precisamos instalar duas novas dependências:
  ```
    expo install react-native-svg
    yarn add --dev react-native-svg-transformer
  ```
  - Após essas instalações precisamos criar um arquivo chamado **metro.config.js** na raiz do projeto e colocar o código abaixo.
  ```
    const { getDefaultConfig } = require("expo/metro-config");

    module.exports = (async () => {
      const {
        resolver: { sourceExts, assetExts }
      } = await getDefaultConfig(__dirname);
      return {
        transformer: {
          babelTransformerPath: require.resolve("react-native-svg-transformer")
        },
        resolver: {
          assetExts: assetExts.filter(ext => ext !== "svg"),
          sourceExts: [...sourceExts, "svg"]
        }
      };
    })();
  ```
  - Com isso, aplicação já rodará sem erros, porém o typescript ainda mostrará erro no editor, para corrigir isso dentro de src, criaremos uma pasta @types, e criaremos um arquivo svg.d.ts
  ```
    declare module "*.svg" {
      import React from 'react';
      import { SvgProps } from 'react-native-svg';
      const content: React.FC<SvgProps>;
      export default content;
    }
  ```
  - Este problema ocorreu com o Svg pois ele é escrito por meio de Tags HTML, por isso precisamos de dependências externas e tantas configurações adicionais, mas no caso do png, precisaremos apenas adicionar um arquivo png.d.ts no mesmo lugar que criamos a anterior e adicionar o código abaixo, para que o typescript entenda que podemos fazer importação de imagens:
  ```
    declare module "*.png"
  ```

## Lidando com a StatusBar
  - Para lidarmos com o distanciamento da StatusBar, principalmente em iPhones que possui um detalhe na tela que pode cobrir o conteúdo, utilizamos um dependência externa.
  ``` npm i react-native-iphone-x-helper ```
  - Com isso na nossa estilização teremos acesso a um função que retorna a altura da StatusBar:
  ```
    import { getStatusBarHeight } from 'react-native-iphone-x-helper';
    ...
    marginTop: getStatusBarHeight();
    ...
  ```
  - Outro helper que essa dependência trás é o **getBottomSpace()**, que pega a distância adequada que deve ter na parte de baixo do celular, também devido ao detalhe na parte inferior dos iPhones.

## IMAGES
  - Neste componenten podemos ver a importação de uma imagem png, e a utilização da função **Image.resolveAssetSource(<image_imported>).uri** para obter o uri da imagem.
  - Além disso também vemos uma estratégia para criar variações do componentes, tendo tamanhos diferentes declarado através das constantes.
  - Outra recurso que vemos, é enviar um array de styles, podendo passar mais de um objeto de estilo.
  ```
    import avatarImg from '../../assets/avatar.png';

    const SIZES = {
      SMALL: {
        containerSize: 32,
        avatarSize: 28
      },
      NORMAL: {
        containerSize: 48,
        avatarSize: 42
      }
    }

    type Props = {
      imageUri: string | undefined,
      size?: 'SMALL' | 'NORMAL'
    }

    const AVATAR_DEFAULT = Image.resolveAssetSource(avatarImg).uri;
    export function UserPhoto({imageUri, size = 'NORMAL'}: Props){
      const { containerSize, avatarSize } = SIZES[size];

      return (
        <Image
          source={{ uri: imageUri || AVATAR_DEFAULT }}
          style={[
            styles.avatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            }
          ]}
        />
      );
    }
  ```
## Gradiente
  - Para lidar com gradiente instalamos outra dependência do expo:
  ``` expo install expo-linear-gradient ```
  - Para implementar, importamos a dependência que instalamos, e utilizamos o componente **LinearGradient**. Esse componente pode receber algumas propriedades de configuração, como colors(cores do gradiente), start(onde o efeito começa nos eixos x e y) e end(seguindo a mesma ideia do anterior).
  ```
    import { LinearGradient } from 'expo-linear-gradient';

  ```

## ScrollView
  - Para ter um elemento scrollável, basta substituirmos as *Views* por *ScrollViews*.
  - Outra vantagem da ScrollView, é que além do **style** temos o **contentContainerStyle** que estiliza o conteúdo dela.
  - Mais uma propriedade que podemos ver aqui também é **keyboardShouldPersistTaps**, para que sempre que o usuário tocar no elemento ScrollView, caso o teclado esteja aberto, ele seja fechado.
  ```
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      { messages.map(message => { return(
        <Message key={message} />
      );}) }
    </ScrollView>
  ```

## Moti
  - Criar animações de forma declarativa. Para instalar executaremos os comandos:
  ```
    yarn add moti
    expo install react-native-reanimated
  ```
  - Além das duas dependências instaladas, teremos que adicionar um plugin no **babel.config.js**.
  ```
    plugins: ['react-native-reanimated/plugin']
  ```
  - Geralmente após essas instalações é bom limparmos o cache do expo executando o comando abaixo.
  ``` expo start -c ```
  - Após isso podemos fechar e executar novamente sem passar o -c.
  - Para implementar, utilizamos o componente MotiView no lugar das nossas Views, e podemos passar algumas propriedades para configurar as animações, como no exemplo abaixo.
  ```
    <MotiView
      from={{ opacity: 0, translateY: -50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 700 }}
      style={styles.container}
    >
  ```
## Tipagem
  - Para tipamos cores, existe uma propriedade chamada **ColorValue** que é exportada direto do ReactNative.
  - Para extenderos a tipagem do TouchableOpacity, podemos importar o TouchableOpacityProps do react-native também, e caso estejamos type, ao invés de tipagem fazemos o código abaixo:
  ```
    type Props = TouchableOpacityProps & {
      title: string,
      color: ColorValue,
      backgroundColor: ColorValue,
    }
  ```
  - Podemos também extrair a propriedade de um componente com o seguinte código(Neste código estamos pegando a tipagem da propriedade name de AntDesign):
  ``` type icon = React.ComponentProps<typeof AntDesign>['name'] ``` 
## Icones
  - O expo já trás alguns icones prontos para utilizarmos.
  ```
    ...
    import { AntDesign } from '@expo/vector-icons';
    ...
    <AntDesign name={<icon_name>}/>
  ```

## Loading
  - Uma boa prática é desabilitarmos o botão quando ele enviar uma requisição, para que o usuário não fique enviado varias requisições seguidas, e o react-native nos ajuda a fazer de uma forma simples e amigável com o **ActivityIndicator**, que trás um spinner de loading que podemos adicioná-lo como componente em nosso botão.
  - Outra novidade que podemos ver nesse botão é a propriedade *activeOpacity*, que não está ligada ao load, mais ela controla o efeito de opacidade quando o usuário clica no botão.
  ```
    ...
    import { ..., ActivityIndicator } from 'react-native';
    ...
    export function Button({ ... }: Props){
      return (
        <TouchableOpacity
          style={[styles.button,{ backgroundColor }]}
          activeOpacity={0.7}
          disabled={isLoading}
          {...rest}
        >
          {isLoading ? <ActivityIndicator color={color} /> : <>
            <Text style={[styles.title, { color }]}>{title}</Text>
          </>}
        </TouchableOpacity>
      );
    }
  ```

## TextInput
  - O *TextInput* é respectivo aos inputs do html. Abaixo vemos algumas das propriedades que esse componente recebe:
  ```
    <TextInput
      keyboardAppearance="dark"
      placeholder="Qual a sua espectativa para o evento?"
      placeholderTextColor={COLORS.GRAY_PRIMARY}
      maxLength={140}
      multiline
      style={styles.input}

      value={message}
      onChangeText={setMessage}
      editable={!sendingMessage}
    />
  ```
  - A propriedade *keyboardAppearence="dark"* funciona apenas para o IOS, e serve para deixar o teclado no modo dark.
  - Outra propriedade interessante que vemos ali é o *editable*, que caso seja falso funcionará como o *readonly* do html tradicional.

## AuthSession
  - Para fazer a função de login precisamos importar uma dependência chamada **AuthSession**, pois quando clicar em login, o usuário será redirecionado para fora da aplicação, e quando ele voltar a aplicação ainda deve estar esperando os dados dele.
  ``` expo install expo-auth-session expo-random ```
  - Com a dependência instalada, iremos:
    - Importar ela em nosso componente
    - Definir as tipagens de retorno
    - Fazer a requisição async com await para aguardar a resposta.
  ```
    ...
    import * as AuthSession from 'expo-auth-session';
    ...
    type AuthorizationResponse = {
      params: {
        code?: string;
        error?: string;
      },
      type?: string;
    }
    ...
    async function signIn(){
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;  
      const { params } = await AuthSessions.startAsync({ authUrl }) as AuthorizationResponse;
    }
  ```
  - Importante que você esteja logado com o expo para que o redirecionamento funcione corretamente sem warnings. Para logar o expo no seu terminal basta rodar o comando abaixo:
  ``` expo login ```
## Github
  - Primeiro montaremos a url do github.
    - *https://github.com/login/oauth/authorize/client_id=${CLIENT_ID}&scope=${SCOPE}*
  - Depois, criando o aplicativo no github deveremos adicionar o link da aplicação, e seguindo a documentação do expo o recomendado é:
    - *https://auth.expo.io/@<username_from_expo>/<your_app_name>*
    - *https://auth.expo.io/@matthews/nlwheatmobile*
  - O nome do seu aplicativo está configurado em app.json.
  - Além disso, temos que adicionar um *schema* em *app.json*, pode ser adicionado após a versão do aplicativo, e o valor desse novo atributo, deve ser o nome da aplicação. Lembrando que é esse schema que será utilizado para o github conseguir retornar para a aplicação.

## Async Storage - Expo
  - É semelhante ao Local Storage da Web.
  ``` expo install @react-native-async-storage/async-storage ```
  - A maior diferença desses dois é que o Storage do mobile, como já diz o nome, é Assíncrono, ou seja, devemos usar await para pegar os seus dados.
  ```
    import AsyncStorage from '@react-native-async-storage/async-storage';
    ...
    await AsyncStorage.setItem('@nlwheat:user', JSON.stringify(user));
    await AsyncStorage.setItem('@nlwheat:token', token);
    ...
  ```

## Alert
  - Para emitir alertas, temos uma função que é exportada do ReactNative para lidar com isso.
  ```
    ...
    import { Alert } from 'react-native';
    ...
    Alert.alert('Escreva a mensagem para enviar.');
    ...
  ```

## Fechar o teclado
  - O ReactNative também tem uma função para fechar o teclado:
  ```
    ...
    import { Keyboard } from 'react-native';
    ...
    Keyboard.dismiss();
    ...
  ```
  - **#ImaginarConstruirTransformar**