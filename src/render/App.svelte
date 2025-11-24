<script lang='ts'>
  import { onMount } from 'svelte'

  const { sendMsg: sendMsgToMainProcess, onReplyMsg } = window.electron

  let log: string = $state('')
  let msg: string = $state('')
  let isSending: boolean = $state(false)
  let logOutput: HTMLTextAreaElement | null = $state(null)

  async function sendMsg() {
    try {
      isSending = true
      log += `[render]: ${msg} \n`
      const data = await sendMsgToMainProcess(msg)
      log += `[main]: ${data} \n`
      msg = ''

      setTimeout(() => {
        // Auto scroll to bottom
        if (logOutput) {
          logOutput.scrollTop = logOutput.scrollHeight
        }
      }, 100)
    }
    catch (error) {
      console.error(error)
    }
    finally {
      isSending = false
    }
  }

  onMount(() => {
    onReplyMsg((data: string) => {
      log += `[main]: ${data} \n`
    })
  })
</script>

<div class='app-container'>
  <header class='app-header'>
    <div class='logo-container'>
      <img alt='logo' src='./assets/logo.png' class='logo' />
    </div>
    <p class='app-subtitle'>Modern desktop application built with Vite + NestJS + Electron</p>
  </header>

  <main class='app-main'>
    <div class='hello-world'>
      <div class='card'>
        <div class='card-body'>
          <div class='log-section'>
            <label class='label' for='log'>Message Log</label>
            <textarea
              bind:this={logOutput}
              bind:value={log}
              class='log-output'
              placeholder='Message logs will appear here...'
              readonly
            ></textarea>

            <div class='log-actions'>
              <p class='card-description'>Communicate with the main process</p>
              <button class='btn btn-secondary btn-sm' disabled={!log} onclick={() => (log = '')}> Clear Log </button>
            </div>
          </div>

          <div class='input-section'>
            <label class='label' for='msg'>Send Message</label>
            <div class='input-group'>
              <input
                bind:value={msg}
                type='text'
                class='input'
                placeholder='Enter message to send to main process...'
                disabled={isSending}
                onkeydown={(e) => {
                  if (e.key === 'Enter') {
                    sendMsg()
                  }
                }}
              />
              <button class='btn btn-primary' disabled={!msg.trim() || isSending} onclick={sendMsg}>
                {#if isSending}
                  Sending...
                {:else}
                  Send
                {/if}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class='app-footer'>
    <p>Fast Development · Efficient Build · Modern Experience</p>
  </footer>
</div>
