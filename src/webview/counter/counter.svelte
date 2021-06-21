<script lang="ts">
   import { onMount, setContext } from 'svelte';
   import type { WebviewApi } from 'vscode-webview';
   import { Col, Container, Row, Button } from 'sveltestrap';
   type State = { count: number };

   export let vscode: WebviewApi<State>;
   setContext('vscode', vscode);

   onMount(() => {
      document.getElementById('counter').style.fontSize = Math.floor(document.getElementById('app').clientHeight / 2) + 'px';
   });

   let count: number = vscode.getState()?.count ?? 0;

   function increment() {
      if (count >= 9999) return;
      count++;
      vscode.setState({ count });
   }

   function decrement() {
      if (count <= 0) return;
      count--;
      vscode.setState({ count });
   }

   function reset() {
      count = 0;
      vscode.setState({ count });
   }

   function close() {
      vscode.postMessage({ command: 'close' });
   }

   const messageMap = {
      increment,
      decrement,
      reset,
   };

   window.addEventListener('message', (event) => {
      const message = event.data;
      messageMap[message.command] && messageMap[message.command]();
   });
</script>

<Container>
   <Row>
      <div id="counter">
         <p>{('0000' + count).slice(-4)}</p>
      </div>
   </Row>
   <Row>
      <Col xs="3"><Button style="width: 100%" on:click={increment}>+</Button></Col>
      <Col xs="3"><Button style="width: 100%" on:click={decrement}>-</Button></Col>
      <Col xs="3"><Button style="width: 100%" on:click={reset}>reset</Button></Col>
      <Col xs="3"><Button style="width: 100%" on:click={close}>close</Button></Col>
   </Row>
</Container>

<style lang="scss">
   #counter {
      text-align: center;
      height: 80%;
   }
</style>
