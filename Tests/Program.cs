using System;
using System.ComponentModel;

namespace SatorImaging.DocFXPages.Tests
{
    namespace Annotations
    {
        /// <example>
        /// What's shown by &lt;example&gt; tag??
        /// </example>
        [AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct)]
        public class MyAttribute : Attribute { }

        public interface IMarkerInterface { }

        public interface IEntry {
            public string AppName { get; }
        }
    }

    namespace Instances
    {
        /// <summary>
        /// Hi, `shown as inline code?`
        /// I'm also appear in inheritance API documents if &lt;inheritdoc/&gt; works.
        /// </summary>
        public class TestClass : Annotations.IMarkerInterface
        {
            /// <summary>The Summary</summary>
            /// <remarks>The Remarks</remarks>
            public static string StaticStringField;
            /// <remarks>The Remarks</remarks>
            public float FloatField;

            public TestClass() { }
        }

        /// <inheritdoc/>
        [Annotations.MyAttribute]
        public sealed class SealedClass : TestClass
        {
            [Obsolete]
            public static int StaticObsoleteField;

            [Obsolete("Obsolete!")]
            public double ObsoleteField;

            [Obsolete("HTML <b>bold</b> tag can be used??<br/>Markdown **bold** syntax enabled??")]
            public SealedClass() { }
            public SealedClass(float val) { }
        }

        /// <summary>Is this *shown as italic??*</summary>
        [Obsolete("This class is deprecated!")]
        public class DeprecatedClass {}
    }

    namespace Hidden
    {
        [EditorBrowsable(EditorBrowsableState.Never)]
        public class HiddenClass
        {
            [EditorBrowsable(EditorBrowsableState.Never)]
            public static void HiddenMethod() { }
        }
    }

    namespace App
    {
        /// <summary>Is this ~~shown as strikethrough??~~</summary>
        public enum IntEnum : int
        {
            Default = -9999,
            First = 100,
            Second,
            [Obsolete]
            Exceeded = 9999,
        }

        /// <summary>Is this <big>shown bigger??</big></summary>
        public enum ULongEnum : ulong
        {
            Default,
            First = 100,
            Second,
            [Obsolete]
            Exceeded = 18446744073709551615,
        }

        /// <summary>
        /// This is main entry class.<br/>
        /// ```csharp
        /// // code block.
        /// UnityEngine.Debug.Log("Hello, world.");
        /// ```
        /// Markdown enabled?? <a href='https://www.sator-imaging.com/'>This is HTML Link Tag</a>
        /// </summary>
        public class Program : Annotations.IEntry
        {
            /// <summary>Is this **shown as bold??**</summary>
            /// <remarks>No remarks</remarks>
            /// <returns>Return code</returns>
            /// <param name="args">Command line arguments</param>
            public static int Main(string[] args) { }

            public string AppName => "The Application";
        }
    }
}
