using System;

public interface ITest
{
    /// <summary>ITest.DoItInterface</summary>
    void DoItInterface();
}

public abstract class Base : ITest
{
    public void DoIt() { }
    public void DoItInterface() { }

    /// <summary>Base.DoItVirtual</summary>
    public virtual void DoItVirtual() { }

    /// <summary>Base.DoItAbstract</summary>
    public abstract void DoItAbstract();

    /// <summary>Base.DoItVirtualOverridden</summary>
    public virtual void DoItVirtualOverridden() { }
}

public class Concrete : Base
{
    public override void DoItAbstract() { }
    public override void DoItVirtualOverridden() { }
}
