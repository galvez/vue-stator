export default function myInjection (context, inject) {
  context.$firstInjection = 'first'
  inject('firstInjection', 'first')

  context.$secondInjection = 'second'
  inject('secondInjection', 'second')
}
