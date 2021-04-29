export default class DiagnosticsLogger
{
  _diagnostics: string[] = [];

  get messages(): string[] {
    return this._diagnostics;
  }

  log(message){
    console.warn(message);
    this._diagnostics.push(message);
  }  
}