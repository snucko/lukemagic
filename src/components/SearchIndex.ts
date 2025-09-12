import elasticlunr from 'elasticlunr';
export function buildIndex(docs) {
  const idx = elasticlunr(function () {
    this.addField('title'); this.addField('summary'); this.addField('tags'); this.setRef('id');
  });
  docs.forEach(d => idx.addDoc(d));
  return idx.toJSON();
}