var query = require('querystring');

exports.params = function params(object, prefix)
{
  var result = '',
    key = '',
    postfix = '&';

  for (i in object)
  {
    // If not prefix like a[one]...
    if ( ! prefix)
    {
      key = query.escape(i);
    }
    else
    {
      key = prefix + '[' + query.escape(i) + ']';
    }

    // String pass as is...
    if (typeof(object[i]) == 'string')
    {
      result += key + '=' + query.escape(object[i]) + postfix;
      continue;
    }

    // objectects and arrays pass depper
    if (typeof(object[i]) == 'object' || typeof(object[i]) == 'array')
    {
      result += exports.params(object[i], key) + postfix;
      continue;
    }

    // Other passed stringified
    if (object[i].toString)
    {
      result += key + '=' + query.escape(object[i].toString()) + postfix;
      continue;
    }
  }
  // Delete trailing delimiter (&) Yep it's pretty durty way but
  // there was an error gettin length of the objectect;
  result = result.substr(0, result.length - 1);
  return result;
}
