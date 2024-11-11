<script lang="ts">
  import { onMount } from 'svelte'
  import logo from './assets/logo.png'

  const { sendMsg: sendMsgToMainProcess, onReplyMsg } = window.electron

  let log: string = $state('')
  let msg: string = $state('')

  async function sendMsg() {
    try {
      log += `[render]: ${msg} \n`
      const data = await sendMsgToMainProcess(msg)
      log += `[main]: ${data} \n`
    } catch (error) {
      console.error(error)
    }
  }

  onMount(() => {
    onReplyMsg((data: string) => {
      log += `[main]: ${data} \n`
    })
  })
</script>

<img alt="logo" src={logo} class="logo" />
<h1>Vite + Svelte + Electron & Esbuild</h1>
<textarea value={log} cols={60} rows={10} disabled={true}></textarea>
<div style="margin-top:20px">
  <input bind:value={msg} type="text" placeholder="send msg to main process" />
  <button style="margin-left:20px" onclick={sendMsg}> Send </button>
</div>

<style>
  .logo {
    width: 400px;
    height: 2;
    border-radius: 1rem;
    box-shadow:
      0 0 #0000,
      0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
</style>
