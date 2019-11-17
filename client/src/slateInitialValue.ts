import { Value } from 'slate'

export const getInitialValue = (value: any) => Value.fromJSON(value)

export const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: '',
          },
        ],
      },
    ],
  },
})
