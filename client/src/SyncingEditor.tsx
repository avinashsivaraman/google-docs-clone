import React, {useState, useRef, useEffect} from 'react';
import { Editor, OnChangeParam } from 'slate-react';
import {getInitialValue, initialValue}  from './slateInitialValue';
import io from 'socket.io-client'
import { Operation, ValueJSON } from 'slate';
import { isKeyHotkey } from 'is-hotkey'



const socket = io('http://localhost:4000')

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')


interface Props {
  name: string
}


const SyncingEditor: React.FC<Props> = ({name}) => {
  const [value, setValue] = useState(initialValue)
  const [remoteUser, setRemoteUser] = useState('')
  const editor = useRef<Editor | null>(null);
  const id = useRef<string>(`${Date.now()}`);
  const remote = useRef<boolean>(false);
  const onChange = (opts: OnChangeParam) => {

    setValue(opts.value)
    const ops = opts.operations
    .filter(
      o =>{
        if (o) {
          return o.type !== 'set_selection' &&
          o.type !== 'set_value' &&
          (!o.data || !o.data.has('source'))
        }
        return false
      }
      )
      .toJS()
      // .map((o: any) => ({ ...o, data: { source: 'one' } }))
      if (ops.length && !remote.current) {
        socket.emit('new-operations', { editorId: id.current, userName: name,opts: ops, value: opts.value})
    }
  }

  useEffect(() => {
    socket.once('initial-state', (value: ValueJSON) => {
      setValue(getInitialValue(value))
    })

    socket.emit('new-client-join')
    socket.on('new-remote-operations', ({editorId, userName, opts, value}:{editorId: string, userName: string, opts: Operation[], value: ValueJSON}) => {
      if (editorId !== id.current) {

        remote.current = true
        setValue(getInitialValue(value))
        setRemoteUser(userName)
        setTimeout(() => {remote.current = false})
        setTimeout(() => setRemoteUser(''), 1000)
      }
    })
    return () => {
      socket.off('new-remote-operations')
    }
  }, [])

  const onKeyDown = (event: any, editor: Editor, next: () => any) => {
    let mark
    console.log(event)
    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  return (
    <>
    <Editor
      className='editor'
      ref = {editor}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      />
    {remoteUser !== '' && <div className='edit-pop'>{remoteUser} edited the docs</div>}
  </>
  )
}

export default SyncingEditor
